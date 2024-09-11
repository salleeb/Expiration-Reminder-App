// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const { userId } = useParams();
  // const [error, setError] = useState(null);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  // const userId = user.userId;
  const userIsAdmin = user.admin;
  // console.log(userIsAdmin);

  const fetchAllUsers = async () => {
    if (userIsAdmin) {
        try {
          const res = await fetch(`${url}dashboard/admin/users`);
          if (!res.ok) {
            throw new Error("Failed to fetch all users");
          }
          const data = await res.json();
          setAllUsers(data.users);
          // console.log(data.users);
          // console.log(allUsers);
        } catch (error) {
          console.error("Read all users failed", error);
        }
      }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <>
      <div>
        <h1>All Users</h1>
        <ul>
          {allUsers.map((user) => (
            <li key={user._id}><Link to={`/dashboard/admin/users/${user._id}`}>{user.name}</Link></li>
          ))}
        </ul>
      </div>
      <Link to={`/dashboard/${userId}`}>Return to dashboard</Link>
    </>
  );
}

export default AllUsers;
