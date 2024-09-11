// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const url = import.meta.env.VITE_APP_URL;

function Product() {
  const [products, setProducts] = useState(null);
  const { userId } = useParams();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const admin = user.admin;
  const notifiedProducts = useRef(new Set());

  // const fetchProduct = async () => {
  //   try {
  //     const res = await fetch(
  //       admin
  //         ? `${url}dashboard/admin/${userId}/my_products`
  //         : `${url}dashboard/${userId}/my_products`
  //     );
  //     if (!res.ok) {
  //       throw new Error(
  //         admin ? "Failed to fetch admin products" : "Failed to fetch user products"
  //       );
  //     }
  //     const data = await res.json();
  //     setProducts(data.products);
  //     checkProductExpiryAndNotify(data.products);
  //     console.log(data.products);
  //   } catch (error) {
  //     console.error(
  //       admin ? "Read all admin products failed" : "Read all user products failed",
  //       error
  //     );
  //   }
  // };

  useEffect(() => {
    fetchProduct();
  }, []);

  // const fetchProduct = async () => {
  //   try {
  //     const res = await fetch(
  //       admin
  //         ? `${url}dashboard/admin/${userId}/my_products`
  //         : `${url}dashboard/${userId}/my_products`
  //     );
  //     if (!res.ok) {
  //       throw new Error(
  //         admin ? "Failed to fetch admin products" : "Failed to fetch user products"
  //       );
  //     }
  //     const data = await res.json();
  //     setProducts(data.products);

  //     data.products.forEach((product) => {
  //       if (!notifiedProducts.current.has(product._id)) {
  //         const expirationDate = new Date(product.exp_date);
  //         const currentDate = new Date();
  //         const timeDifference = expirationDate - currentDate;
  //         const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  //         if (daysDifference <= 7 && daysDifference >= 0) {
  //           Store.addNotification({
  //             title: "Product Expiring Soon",
  //             message: `${product.title} will expire on ${expirationDate.toLocaleDateString()}`,
  //             type: "warning",
  //             insert: "top",
  //             container: "top-right",
  //             animationIn: ["animate__animated", "animate__fadeIn"],
  //             animationOut: ["animate__animated", "animate__fadeOut"],
  //             dismiss: {
  //               duration: 5000,
  //               onScreen: true,
  //             },
  //           });

  //           notifiedProducts.current.add(product._id);
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.error(
  //       admin ? "Read all admin products failed" : "Read all user products failed",
  //       error
  //     );
  //   }
  // };

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        admin
          ? `${url}dashboard/admin/${userId}/my_products`
          : `${url}dashboard/${userId}/my_products`
      );
      if (!res.ok) {
        throw new Error(
          admin ? "Failed to fetch admin products" : "Failed to fetch user products"
        );
      }
      const data = await res.json();
      setProducts(data.products);
      checkProductExpiryAndNotify(data.products);
    } catch (error) {
      console.error(
        admin ? "Read all admin products failed" : "Read all user products failed",
        error
      );
    }
  };

  const checkProductExpiryAndNotify = async (products) => {
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      products.forEach(product => {
        if (!notifiedProducts.current.has(product._id)) {
          const expirationDate = new Date(product.exp_date);
          const currentDate = new Date();
          const timeDifference = expirationDate - currentDate;
          const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

          if (daysDifference <= 7 && daysDifference >= 0) {
            Store.addNotification({
              title: "Product Expiring Soon",
              message: `${product.title} will expire on ${expirationDate.toLocaleDateString()}`,
              type: "warning",
              insert: "top",
              container: "top-right",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true,
              },
            });

            if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
              navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification('Product Expiring Soon', {
                  body: `${product.title} will expire on ${expirationDate.toLocaleDateString()}`,
                  icon: '/path/to/icon.png',
                  badge: '/path/to/badge.png',
                });
              });
            }
            notifiedProducts.current.add(product._id);
          }
        }
      });
    } else {
      console.warn('Notification permission denied');
    }
  };

  return (
    <>
      <div>
        <h2>My Products</h2>
        {products === null ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>There are no products...</p>
        ) : (
          products.map((product) => {
            return (
              <ul key={product._id}>
                <li key={product._id}>
                  <Link to={`/dashboard/products/${product._id}`}>
                    {product.title} - {product.desc} - Expiration Date:{" "}
                    {new Date(product.exp_date).toLocaleDateString()}
                  </Link>
                </li>
              </ul>
            );
          })
        )}
      </div>
      <Link to={`/${userId}/add-product`}>Add a product</Link>
      <br />
      <Link to={`/dashboard/${userId}`}>Back to dashboard</Link>
    </>
  );
}

export default Product;
