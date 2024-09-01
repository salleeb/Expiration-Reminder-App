// import PropTypes from "prop-types";
// // import axios from "axios";
// // import { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import EditUser from "./EditUser";
// // import Button from "../components/Button";

// const url = import.meta.env.VITE_APP_URL;

// function AllProducts({ allProducts }) {
//   //   const [allProducts, setAllProducts] = useState([]);
    
//   // useEffect(() => {
//   //   const readAllProducts = async () => {
//   //     try {
//   //       const res = await axios.get(`${url}${currentUserId}/products`);
//   //           setAllProducts(res.data);
//   //           console.log(allProducts);
//   //     } catch (error) {
//   //       console.error("Read all users failed", error);
//   //     }
//   //   };

//   //   readAllProducts();
//   // }, [currentUserId, allProducts]);

//   console.log(allProducts);
//   let test = allProducts.map((product) => {
//     console.log(product.title);
//   })
//   console.log(test);

//   return (
//     <>
//       <h2>AllProducts</h2>
//       {allProducts.map((product) => (
//         console.log(product),
//             <ul key={product._id}>
//               <li>
//                 {product.title} - {product.desc}
//                 {/* <Link to={`/user/${user._id}`}>Edit user</Link> */}
//                 {/* <Button onClick={() => deleteOneUser(user._id)}>&#128465;</Button> */}
//               </li>
//             </ul>
//         ))}
//     </>
//   );
// }

// export default AllProducts;

// AllProducts.propTypes = {
//   allProducts: PropTypes.array.isRequired,
// };