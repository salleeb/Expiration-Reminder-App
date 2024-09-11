// eslint-disable-next-line no-unused-vars
import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react';
import trashBin from '@iconify-icons/akar-icons/trash-bin';

const url = import.meta.env.VITE_APP_URL;

function EditUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [message, setMessage] = useState("");
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      setCurrentUserId(currentUser.userId);
      console.log(currentUser.userId);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await fetch(`${url}dashboard/admin/users/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      setUser(data.user);
      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
      });
    } catch (error) {
      console.error("Read one user failed", error);
      setMessage("Failed to load user data.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm("Are you sure you want to save these changes?");

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.put(`${url}dashboard/admin/users/edit/${userId}`, formData);
      console.log("Form data submitted:", formData);
      setMessage("Changes saved successfully!");
      navigate(`/dashboard/admin/users/${userId}`);
    } catch (error) {
      console.error("Failed to save changes:", error);
      setMessage("Failed to save changes.");
    }
  };

  const handleDeleteUser = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user permanently? The user cannot be restored.");

    if (!isConfirmed) {
      return;
    }

    try {
      const res = await axios.delete(`${url}users/${userId}`);
      console.log(res.data.message);
      setMessage("User deleted successfully");
      navigate(`/dashboard/${currentUserId}/users`);
    } catch (error) {
      console.error("Error deleting user:", error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h1>Edit User</h1>
      {message && <p>{message}</p>}
      {user ? (
        <>
          <form onSubmit={handleEdit}>
            <label>
              Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>
            <button type="submit">Save Changes</button>
          </form>
          <button onClick={handleDeleteUser}>
            <Icon icon={trashBin} width="24" height="24" />
          </button>
        </>
      ) : (
        <p>There is no user data...</p>
      )}
      <Link className="return-arrow" to={`/dashboard/${currentUserId}/users`}>&lt;</Link>
      <br />
      <Link to={`/dashboard/${currentUserId}`}>Back to dashboard</Link>
    </div>
  );
}

export default EditUser;