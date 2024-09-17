// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      "Food",
      "Pet food",
      "Medicine",
      "Skin Care",
      "Hair products",
    ];
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const deleteCategory = (categoryToDelete) => {
    setCategories((prevCategories) =>
      prevCategories.filter(category => category !== categoryToDelete)
    );
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

CategoriesProvider.propTypes = {
  children: PropTypes.node,
};

export default CategoriesContext;
