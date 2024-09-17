// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import CategoriesContext from './CategoriesContext';

const useCategories = () => useContext(CategoriesContext);

export { useCategories };