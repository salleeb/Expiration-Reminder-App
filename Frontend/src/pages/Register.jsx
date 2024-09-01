import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const url = import.meta.env.VITE_APP_URL;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${url}register`, formData);
      console.log(formData);
      if (formData.password !== formData.confirm_password) {
        console.error("Password do not match");
        return;
      }

      if (
        !formData.email ||
        !formData.name ||
        !formData.password ||
        !formData.confirm_password
      ) {
        console.error("Add all data, please");
        return;
      }
      navigate('/login')
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password || ""}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm password"
            value={formData.confirm_password || ""}
            onChange={handleInputChange}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}

export default Register;
