import axios from "axios";

const url = import.meta.env.VITE_APP_URL;

// Products
export const createOneProduct = async (userId, formData) => {
  try {
    const res = await axios.post(`${url}${userId}/add-product`, formData);
    return res.data;
  } catch (error) {
    throw new Error(`Read all products failed: ${error.message}`);
  }
};

export const readAllProducts = async () => {
  try {
    const res = await axios.get(`${url}dashboard/admin/products`);
    return res.data.products;
  } catch (error) {
    throw new Error(`Read all products failed: ${error.message}`);
  }
};

export const readUserProducts = async (currentUserId) => {
  try {
    const res = await axios.get(`${url}dashboard/${currentUserId}/my_products`);
    return res.data.products;
  } catch (error) {
    throw new Error(`Read all user products failed: ${error.message}`);
  }
};

export const adminReadUserProducts = async (userId) => {
  try {
    const res = await axios.get(`${url}dashboard/admin/${userId}/my_products`);
    return res.data.products;
  } catch (error) {
    throw new Error(`Read all admin products failed: ${error.message}`);
  }
};

export const readOneProduct = async (productId) => {
  try {
    const res = await axios.get(`${url}dashboard/products/${productId}`);
    return res.data.product;
  } catch (error) {
    throw new Error(`Read one product failed: ${error.message}`);
  }
};

export const updateOneProduct = async (productId, formData) => {
  try {
    const res = await axios.patch(
      `${url}dashboard/products/edit/${productId}`,
      formData
    );
    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to save changes: ${error.message}`);
  }
};

export const deleteOneProduct = async (productId, product) => {
  try {
    const res = await axios.delete(`${url}dashboard/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${product}`,
      },
    });
    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to save changes: ${error.message}`);
  }
};

// Users
export const createOneUser = async (formData) => {
  try {
    const res = await axios.post(`${url}register`, formData);
    return res.data;
  } catch (error) {
    throw new Error(`Create user failed: ${error.message}`);
  }
};

export const readAllUsers = async () => {
  try {
    const res = await axios.get(`${url}dashboard/admin/users`);
    return res.data.users;
  } catch (error) {
    throw new Error(`Read all users failed: ${error.message}`);
  }
};

export const readOneUser = async (userId) => {
  try {
    const res = await axios.get(`${url}dashboard/admin/users/${userId}`);
    return res.data.user;
  } catch (error) {
    throw new Error(`Read one user failed: ${error.message}`);
  }
};

export const updateOneUser = async (userId, formData) => {
  try {
    const res = await axios.patch(
      `${url}dashboard/admin/users/edit/${userId}`,
      formData
    );
    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to save changes: ${error.message}`);
  }
};

export const deleteOneUser = async (userId) => {
  try {
    const res = await axios.delete(`${url}users/${userId}`);
    const userProducts = await axios.get(
      `${url}dashboard/${userId}/my_products`
    );
    const products = userProducts.data.products;

    for (let product of products) {
      await axios.delete(`${url}dashboard/products/${product._id}`);
    }

    console.log("API Response:", res.data);
    console.log("All user products deleted successfully");
    return res.data;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};
