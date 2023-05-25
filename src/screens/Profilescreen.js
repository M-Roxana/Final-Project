import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs } from "antd";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Divider, Space, Tag } from "antd";

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  });
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: `Profile`,
      children: <MyProfile />,
    },
    {
      key: "2",
      label: `Bookings`,
      children: <MyBookings />,
    },
  ];

  return (
    <div className="m-3">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = (
          await axios.post(`/api/bookings/getbookingsbyuserid`, {
            userId: user._id,
          })
        ).data;
        console.log(user._id);
        console.log(data);
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, []);

  async function cancelBooking(bookingId, roomId) {
    try {
      setLoading(true);
      const result = await axios.post(`/api/bookings/cancelbooking`, {
        bookingId,
        roomId,
      }).data;
      console.log(result);
      setLoading(false);
      Swal.fire("Congrats", "Your booking has been cancelled", "success").then(
        (result) => {
          window.location.reload();
        }
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire("Oops", "something went wrong", "error");
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-md-6 ">
          {loading && <Loader />}
          {bookings &&
            bookings.map((booking, index) => {
              return (
                <div className="bs" key={index}>
                  <h1>{booking.room}</h1>
                  <p>
                    <b>Booking Id:</b> {booking._id}
                  </p>
                  <p>
                    <b>Transaction Id:</b> {booking.transactionId}
                  </p>
                  <p>
                    <b>Check In:</b> {booking.fromDate}
                  </p>
                  <p>
                    <b>Check Out:</b> {booking.toDate}
                  </p>
                  <p>
                    <b>Amount:</b> {booking.totalAmount}
                  </p>
                  <p>
                    <b>Status: </b>
                    <Space size={[0, 8]} wrap>
                      {booking.status !== "cancelled" ? (
                        <Tag color="green">CONFIRMED</Tag>
                      ) : (
                        <Tag color="red">CANCELLED</Tag>
                      )}
                    </Space>
                  </p>
                  <div className="text-right">
                    {booking.status === "booked" ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          cancelBooking(booking._id, booking.roomId);
                        }}
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export function MyProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div>
      <h1>My Profile</h1>
      <br />
      <h1>Name: {user.name}</h1>
      <h1>Email: {user.email}</h1>
      <h1>{user.isAdmin ? "IsAdmin : Yes" : ""}</h1>
    </div>
  );
}
