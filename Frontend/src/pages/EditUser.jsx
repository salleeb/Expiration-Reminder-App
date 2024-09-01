import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const url = import.meta.env.VITE_APP_URL;

function EditUser({ selectedUserId, currentUserId, setSelectedUserId }) {
  const [user, setUser] = useState(null);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    // console.log(selectedUserId);
    const getOneUser = async () => {
      if (!selectedUserId) {
        return;
      }
      try {
        const response = await axios.get(`${url}user/${selectedUserId}`);
        const userData = response.data.user;
        setUser(userData);
        // console.log(user);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getOneUser();
  }, [selectedUserId]);

  useEffect(() => {
    const isChanged = Object.entries(formData).some(
      ([key, value]) => user && user[key] !== value
    );
    setIsDataChanged(isChanged);
  }, [formData, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${url}user/${selectedUserId}`, formData);
      console.log(formData);
      if (!formData.email && !formData.name) {
        document.querySelector("#button").disabled = true;
      }
      console.log("Changes saved successfully!");
    } catch (error) {
      console.error("Register changes error:", error);
    }
  };

  const deleteOneUser = async (userId) => {
    try {
      await axios.delete(`${url}user/${userId}`);
      console.log("User deleted successfully");
      setSelectedUserId("");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Edit user</h2>
        <form onSubmit={handleEdit}>
          <input
            type="text"
            name="name"
            placeholder={user?.name || ""}
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder={user?.email || ""}
            value={formData.email}
            onChange={handleInputChange}
          />
          <button type="submit" id="button" disabled={!isDataChanged}>
            Save
          </button>
        </form>
      </div>
      <Button onClick={() => deleteOneUser(user._id)}>&#128465;</Button>
      <Link to={`dashboard/${currentUserId}`}>Back to dashboard</Link>
    </>
  );
}

export default EditUser;

EditUser.propTypes = {
  selectedUserId: PropTypes.string.isRequired,
  setSelectedUserId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};
