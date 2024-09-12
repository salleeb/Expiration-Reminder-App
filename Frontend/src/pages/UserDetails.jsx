// eslint-disable-next-line no-unused-vars
import React from "react";
import { readOneUser } from "../functions/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function UserDetails() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    genReadOneUser();
  }, [userId]);

  const genReadOneUser = async () => {
    try {
      const res = await readOneUser(userId);
      console.log("Fetched User:", res);
      setSelectedUser(res);
      console.log(res);
    } catch (error) {
      console.error("Failed to fetch one user", error);
    }
  };

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
