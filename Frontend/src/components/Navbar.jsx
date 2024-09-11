// eslint-disable-next-line no-unused-vars
import React from 'react';
// import PropTypes from "prop-types";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import '../app.css';

const url = import.meta.env.VITE_APP_URL;

function Navbar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${url}logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      localStorage.clear()
      navigate("/");
      console.log("Logout successful:", res.data);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  console.log(user);

  return (
    <>
    <SearchBar />
      <nav className="flex">
        {user ? (
          <>
          <Button onClick={handleLogout}>Log out</Button>
          </>
        ) : (
          <>
            <Button>
              <Link to={"/login"}>Log in</Link>
            </Button>
            <Button>
              <Link to={"/register"}>Register</Link>
            </Button>
          </>
        )}

        {/* <Button>
          <Link to={"/login"}>Log in</Link>
        </Button>
        <Button>
          <Link to={"/register"}>Register</Link>
        </Button>
        <Button onClick={handleLogout}>Log out</Button> */}
      </nav>
    </>
  );
}

// Navbar.propTypes = {
//   children: PropTypes.node.isRequired,
//   onClick: PropTypes.func,
//   red: PropTypes.bool,
//   white: PropTypes.bool,
//   className: PropTypes.string,
// };

export default Navbar;
