import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

function Bookingscreen() {
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [room, setroom] = useState({
    name: "",
    maxcount: "",
    phonenumber: "",
    rentperday: "",
    imageurls: [],
  });
  const [totalAmount, setTotalAmount] = useState();
  const { roomId, fromDate, toDate } = useParams();

  const finishDate = moment(toDate, "DD/MM/YYYY");
  const startDate = moment(fromDate, "DD/MM/YYYY");

  const totalDays = finishDate.diff(startDate, "days");

  useEffect(() => {
    async function fetchData() {
      try {
        setloading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", {
            roomId: roomId,
          })
        ).data;
        setTotalAmount(totalDays * data.rentperday);
        setroom(data);
        setloading(false);
      } catch (error) {
        setloading(false);
        seterror(true);
      }
    }
    fetchData();
  }, []);

  async function bookRoom() {
    const bookingDetails = {
      room,
      userId: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromDate,
      toDate,
      totalAmount,
      totalDays,
    };

    try {
      const result = await axios.post("/api/bookings/bookroom", bookingDetails)
        .data;
    } catch (error) {}
  }

  return (
    <div className="m-5">
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : error ? (
        <Error message="Something went wrong, please try again later" />
      ) : (
        <div className="row justify-content-center mt-5 bs">
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} className="bigimg" />
          </div>{" "}
          <div className="col-md-6">
            <div style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {room.name}</p>
                <p>From Date: {fromDate}</p>
                <p>To Date: {toDate}</p>
                <p>Max Count: {room.maxcount}</p>
                <h1>Amount</h1>
                <hr />
                <p>Total days: {totalDays}</p>
                <p>Rent per day: {room.rentperday}</p>
                <p>Total Amount: {totalAmount}</p>
                <button className="btn btn-primary" onClick={bookRoom}>
                  Pay Now
                </button>
              </b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
