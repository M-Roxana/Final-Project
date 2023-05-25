import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [succes, setsucces] = useState();

  async function register() {
    if (password == cpassword) {
      const user = {
        name,
        email,
        password,
        cpassword,
      };

      try {
        setLoading(true);
        const result = await axios.post(`/api/users/register`, user).data;
        setLoading(false);
        setsucces(true);

        setName("");
        setEmail("");
        setPassword("");
        setCpassword("");
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    } else {
      alert("Passwords not matched");
    }
  }

  return (
    <div>
      {loading && <Loader />}
      {error && <Error />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {succes && <Success message="Registration successfully!" />}
          <div className="bs">
            <h2 className="text-center">Register</h2>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="confirm password"
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
            />
            <button className="btn btn-primary mt-3" onClick={register}>
              {" "}
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
