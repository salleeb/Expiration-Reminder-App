// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readAllUsers } from "../functions/api";

function AllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    genReadAllUsers();
  }, []);

  const genReadAllUsers = async () => {
    try {
      const res = await readAllUsers();
      console.log("Fetched Users:", res);
      setAllUsers(res || []);
    } catch (error) {
      console.error("Failed to fetch all users", error);
    }
  };

  return (
    <>
      <div>
        <h1>All Users</h1>
        <ul>
          {allUsers.map((user) => (
            <li key={user._id}>
              <Link to={`/dashboard/admin/users/${user._id}`}>{user.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <Link to={`/dashboard/${userId}`}>Return to dashboard</Link>
    </>
  );
}

export default AllUsers;
