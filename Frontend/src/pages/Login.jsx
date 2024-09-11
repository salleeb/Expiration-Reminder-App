// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

const url = import.meta.env.VITE_APP_URL;

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${url}login`, formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("Token stored in local storage:", res.data.token);
      } else {
        console.error("Token not received from the server");
      }
      console.log("Logged in:", res.data);
      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User stored in local storage:", user);
      const userId = res.data.userId;
      navigate(`/dashboard/${userId}`);
    } catch (error) {
      console.error("Login error:", error);
    }
    // Token expires after 24h
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

    setTimeout(() => {
      localStorage.removeItem("token");
    }, twentyFourHoursInMilliseconds);
  };

  return (
    <>
        <>
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button type="submit">Login</button>
            </form>
          </div>
          <p>
            Don`t have an account? <Link to={"/register"}>Register!</Link>
          </p>
        </>
      {/* )} */}
    </>
  );
}

export default Login;
