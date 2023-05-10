import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space } from "antd";
import "antd/dist/reset.css";
import moment from "moment";

function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState(false);

  const { RangePicker } = DatePicker;

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setrooms(data);
        setloading(false);
      } catch (error) {
        seterror(true);
        setloading(false);
        console.log(rooms);
      }
    };
    fetchData();
  }, []);

  function filterByDate(dates) {
    setFromDate(dates[0].format("DD-MM-YYYY"));
    setToDate(dates[1].format("DD-MM-YYYY"));
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {/* {loading ? (
          <Loader />
        ) : rooms.length > 1 ? (
          rooms.map((room, index) => {
            return (
              <div className="col-md-9 mt-3" key={index}>
                <Room room={room} fromDate={fromDate} toDate={toDate} />
              </div>
            );
          })
        ) : error ? (
          <Error message="Something went wrong, please try again later" />
        ) : (
          <></>
        )} */}

        {loading ? (
          <Loader />
        ) : error ? (
          <Error message="Something went wrong, please try again later" />
        ) : (
          rooms.map((room, index) => {
            return (
              <div className="col-md-9 mt-3" key={index}>
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
