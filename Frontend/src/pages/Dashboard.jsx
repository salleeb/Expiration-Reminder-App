import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EditUser from "./EditUser";
import Button from "../components/Button";

const url = import.meta.env.VITE_APP_URL;

function Dashboard({ currentUser, currentUserId, admin }) {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allUserProducts, setAllUserProducts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  // const [test, setTest] = useState();
  // const dataToPass = { currentUserId };

  console.log(currentUser);
  console.log(currentUserId);
  console.log(admin);
  console.log(allProducts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}dashboard/${currentUserId}`);
        setAllUsers(res.data.users);
        setAllProducts(res.data.products);
        console.log(allUsers);
        console.log(allProducts);
      } catch (error) {
        console.error("Read all users failed", error);
      }
    };

    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    const userProducts = allProducts.filter(
      (product) => product.user === currentUserId
    );
    setAllUserProducts(userProducts);
    console.log(allUserProducts);

  }, [allProducts, currentUserId])

  const onUserClick = (userId) => {
    setSelectedUserId(userId);
  };
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${url}logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      navigate("/");
      console.log("Logout successful:", res.data);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // const searchquery = (x, z) => {
  //   const search = allProducts.map((res) => {
  //     x = res.title;
  //     z = res.desc;
  //     const result = [...x, ...z];
  //     return result
  //   })
    // const search = allProducts.find((product) => {
    //   const titleMatches = product.title === title;
    //   const descMatches = product.desc === desc;
  
    //   const searchAll = titleMatches && descMatches;
  
    //   return searchAll;
    // });
    
  // };
  // setTest(search())


  return (
    <>
      <h2>Dashboard</h2>
        <Button onClick={handleLogout}>Log out</Button>
      <br />
      {/* <form onSubmit={searchquery}>
      <input type="text" placeholder="Search.." />
      <button type="submit"></button>
      </form> */}
      {/* <Link to={{ pathname: `/${currentUserId}/add-product`, state: dataToPass }}>Add a product</Link> */}
      <Link to={`/${currentUserId}/add-product`}>Add a product</Link>
      {admin ? (
        <>
          <h2>Hello Admin!</h2>
          <br />
          <Link to={`dashboard/${currentUserId}/register`}>Add a user</Link>
          <div>
            <h2>Users</h2>
            {allUsers && allUsers.length > 0 ? (
              allUsers.map((user) => (
                <ul key={user._id}>
                  <li onClick={() => onUserClick(user._id)}>
                    {user.name} - {user.email}
                    <Link to={`/user/${user._id}`}>Edit user</Link>
                    <EditUser
                      selectedUserId={selectedUserId}
                      currentUserId={currentUserId}
                      setSelectedUserId={setSelectedUserId}
                    ></EditUser>
                  </li>
                </ul>
              ))
            ) : (
              <>
                <div>
                  <p>No registered users</p>
                </div>
              </>
            )}
          </div>

          <div>
            <h2>Products</h2>
            {allProducts && allProducts.length > 0 ? (
              allProducts.map((product) => (
                <ul key={product._id}>
                  <li>
                    {product.title} - {product.desc}
                  </li>
                </ul>
              ))
            ) : (
              <>
                <div>
                  <h3>No registered products</h3>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <h2>Not admin...</h2>
          <Link to={`/${currentUserId}/add-product`}>Add a product</Link>
          <div>
            <h2>All your products</h2>
            {allUserProducts && allUserProducts.length > 0 ? (
              allUserProducts.map((product) => (
                <ul key={product.id}>
                  <li>
                    {product.title} - {product.desc} - {product.exp_date}
                  </li>
                </ul>
              ))
            ) : (
              <>
                <div>
                  <p>No registered products</p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;

Dashboard.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  currentUser: PropTypes.array.isRequired,
  admin: PropTypes.bool.isRequired,
};
