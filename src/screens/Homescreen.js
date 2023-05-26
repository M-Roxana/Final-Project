import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space } from "antd";
import "antd/dist/reset.css";
import moment from "moment";
const _ = require("lodash");
function Homescreen() {
  const { RangePicker } = DatePicker;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState(false);

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [duplicateRooms, setDuplicateRooms] = useState();

  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = (await axios.get(`/api/rooms/getallrooms`)).data;
        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  function filterByDate(dates) {
    if (dates) {
      setFromDate(dates[0].format("DD-MM-YYYY"));
      setToDate(dates[1].format("DD-MM-YYYY"));
      var tempRooms = [];
      var availability = true;

      for (const room of duplicateRooms) {
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            const start = moment(booking.fromDate, "DD-MM-YYYY");
            const startStr = start.format("YYYY-MM-DD");
            const end = moment(booking.toDate, "DD-MM-YYYY");
            const endStr = end.format("YYYY-MM-DD");
            if (
              moment(dates[0].format("YYYY-MM-DD")).isBetween(
                startStr,
                endStr,
                undefined,
                "[]"
              ) &&
              moment(dates[1].format("YYYY-MM-DD")).isBetween(
                startStr,
                endStr,
                undefined,
                "[]"
              ) &&
              (moment(startStr).isBetween(
                dates[0].format("YYYY-MM-DD"),
                dates[1].format("YYYY-MM-DD"),
                undefined,
                "[]"
              ) ||
                moment(endStr).isBetween(
                  dates[0].format("YYYY-MM-DD"),
                  dates[1].format("YYYY-MM-DD"),
                  undefined,
                  "[]"
                ))
            ) {
              availability = false;
            }
          }
        }

        if (availability == true || room.currentbookings.length == 0) {
          tempRooms.push(room);
        }
        setRooms(tempRooms);
      }
    } else {
      setRooms(duplicateRooms);
    }
  }

  function filterBySearch() {
    const tempRooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(searchKey.toLowerCase())
    );

    setRooms(tempRooms);
  }

  function filterByType(e) {
    setType(e);
    if (e !== "all") {
      const tempRooms = duplicateRooms.filter(
        (room) => room.type.toLowerCase() == e.toLowerCase()
      );

      setRooms(tempRooms);
    } else {
      setRooms(duplicateRooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="search rooms"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>
        <div className="col-md-4">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={type}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="deluxe">Delux</option>
            <option value="non-deluxe">Non-Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : (
          // ) : error ? (
          //   <Error message="Something went wrong, please try again later" />
          rooms.map((room, index) => {
            return (
              <div className="col-md-9 mt-3 " key={index}>
                <Room room={room} fromDate={fromDate} toDate={toDate} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Homescreen;
