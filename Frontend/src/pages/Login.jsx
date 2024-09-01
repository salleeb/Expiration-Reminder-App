import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";

const url = import.meta.env.VITE_APP_URL;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, serCurrentUserId] = useState("");
  const [currentUser, setCurrentUser] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState([])

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
        const userId = res.data.userId;
        serCurrentUserId(userId);
        setData(res.data);
      } else {
        console.error("Token not received from the server");
      }
      console.log("Logged in:", res.data);
      setCurrentUser(res.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
    }

    // Token expires after 24h
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

    setTimeout(() => {
      localStorage.removeItem("token");
    }, twentyFourHoursInMilliseconds);
  };

  useEffect(() => {
    setAdmin(data.admin)
    console.log(admin);

  }, [data.admin, admin]);

  console.log(currentUserId);
  console.log(currentUser);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Dashboard
            currentUser={currentUser}
            currentUserId={currentUserId}
            admin={admin}
          ></Dashboard>
        </>
      ) : (
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
      )}
    </>
  );
}

export default Login;
