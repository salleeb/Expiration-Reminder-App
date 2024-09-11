// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

function UserDetails() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { userId } = useParams();
//   const storedUser = localStorage.getItem("user");
//   const user = JSON.parse(storedUser);
//   const userId = user.userId;
//   const admin = user.admin;

//   console.log(admin);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${url}dashboard/admin/users/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      setSelectedUser(data.user);
      console.log(data.user);
    } catch (error) {
      console.error("Read selected user failed", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <>
      <div>
        <h2>User Details</h2>
        {selectedUser === null ? (
          <p>Loading...</p>
        ) : (
          <>
          <h3>{selectedUser.name}</h3>
          <ul>
            <li key={selectedUser._id}>
                {selectedUser.name} - {selectedUser.email}
                <Link to={`/dashboard/admin/users/edit/${userId}`}>Edit</Link>
            </li>
          </ul>
          </>
        )}
      </div>
      <br />
      <Link to={`/dashboard/${userId}`}>Back to dashboard</Link>
    </>
  );
}

export default UserDetails;