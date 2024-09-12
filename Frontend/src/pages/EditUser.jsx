// eslint-disable-next-line no-unused-vars
import React from "react";
import { readOneUser, updateOneUser, deleteOneUser } from "../functions/api";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import trashBin from "@iconify-icons/akar-icons/trash-bin";

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      setCurrentUserId(currentUser.userId);
      console.log(currentUser.userId);
    }
  }, []);

  useEffect(() => {
    genReadOneUser();
  }, []);

  const genReadOneUser = async () => {
    try {
      const res = await readOneUser(userId);
      console.log("Fetched User:", res);
      setUser(res);
      setFormData({
        name: res.name || "",
        email: res.email || "",
      });
    } catch (error) {
      console.error("Failed to fetch one user", error);
    }
  };

  const handleUpdateOneUser = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await updateOneUser(userId, formData);
      console.log("Form data submitted:", formData);
      setMessage("Changes saved successfully!");
      navigate(`/dashboard/admin/users/${userId}`);
    } catch (error) {
      console.error("Failed to fetch one products", error);
      setMessage("Failed to save changes.");
    }
  };

  const handleDeleteOneUser = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user and products associated with user permanently? User and associated products cannot be restored."
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const res = await deleteOneUser(userId);
      console.log(res.message);
      setMessage("User deleted successfully");
      navigate(`/dashboard/${currentUserId}/users`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h1>Edit User</h1>
      {message && <p>{message}</p>}
      {user ? (
        <>
          <form onSubmit={handleUpdateOneUser}>
            <label>
              Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </label>
            <button type="submit">Save Changes</button>
          </form>
          <button onClick={handleDeleteOneUser}>
            <Icon icon={trashBin} width="24" height="24" />
          </button>
        </>
      ) : (
        <p>There is no user data...</p>
      )}
      <Link className="return-arrow" to={`/dashboard/${currentUserId}/users`}>
        &lt;
      </Link>
      <br />
      <Link to={`/dashboard/${currentUserId}`}>Back to dashboard</Link>
    </div>
  );
}

export default EditUser;
