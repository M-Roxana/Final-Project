import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

function Bookingscreen() {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [room, setRoom] = useState({
    name: "",
    maxcount: "",
    phonenumber: "",
    rentperday: "",
    imageurls: [],
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [totalAmount, setTotalAmount] = useState();
  const { roomId, fromDate, toDate } = useParams();

  const finishDate = moment(toDate, "DD/MM/YYYY");
  const startDate = moment(fromDate, "DD/MM/YYYY");

  const totalDays = finishDate.diff(startDate, "days");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("currentUser")) {
          // setLoading(false);
          const result = await Swal.fire({
            icon: "warning",
            text: "Please log in to book a room",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        } else {
          setLoading(true);
          const data = (
            await axios.post(`/api/rooms/getroombyid`, {
              roomId: roomId,
            })
          ).data;
          setTotalAmount(totalDays * data.rentperday);
          setRoom(data);
          setLoading(false);
          setLoggedIn(true);
        }
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchData();
  }, []);

  async function onToken(token) {
    const bookingDetails = {
      room,
      userId: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromDate,
      toDate,
      totalAmount,
      totalDays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post(`/api/bookings/bookroom`, bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulation",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("Ooops", "Something went wrong", "error");
    }
  }

  return (
    <div className="m-5">
      {!loggedIn ? (
        <h1>
          <Loader />
        </h1>
      ) : loading ? (
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
                <p>
                  Name: {JSON.parse(localStorage.getItem("currentUser")).name}
                </p>
                <p>From Date: {fromDate}</p>
                <p>To Date: {toDate}</p>
                <p>Max Count: {room.maxcount}</p>
                <h1>Amount</h1>
                <hr />
                <p>Total days: {totalDays}</p>
                <p>Rent per day: {room.rentperday}</p>
                <p>Total Amount: {totalAmount}</p>
              </b>

              <div>
                <StripeCheckout
                  token={onToken}
                  amount={totalAmount * 100}
                  currency="RON"
                  stripeKey="pk_test_51N7xQTCuq1ZHosa2GqrpDMlZRatg6klukgjNb0ZSGFuzrnvWnqLBof92Cs0DF735OkSsdJ9YbtU2cxTifqE0zSmh003ibw63iw"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
