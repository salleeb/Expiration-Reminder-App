// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCategories } from "../contexts/useCategories";
import { useTags } from "../contexts/useTags";
import {
  readAllProducts,
  readAllUsers,
  readUserProducts,
} from "../functions/api";

function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allUserProducts, setAllUserProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [user, setUser] = useState("");
  const [userProduct, setUserProduct] = useState("");
  const [productSuggestion, setProductSuggestion] = useState([]);
  const [userSuggestion, setUserSuggestion] = useState([]);
  const [userProductSuggestion, setUserProductSuggestion] = useState([]);
  const [clicked, setClicked] = useState(false);
  const { categories } = useCategories() || { categories: [] };
  const { tags } = useTags() || { tags: [] };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const storedUser = localStorage.getItem("user");
  const currentUser = JSON.parse(storedUser);

  useEffect(() => {
    if (storedUser) {
      setCurrentUserIsAdmin(currentUser.admin);
      setCurrentUserId(currentUser.userId);
      console.log(currentUser);
      console.log(currentUserIsAdmin);
      console.log(currentUserId);
    }
  }, [currentUserId, currentUser]);

  useEffect(() => {
    if (currentUserIsAdmin) {
      genReadAllProducts();
      genReadAllUsers();
    } else {
      genReadAllUserProducts();
    }
  }, [currentUserIsAdmin]);

  useEffect(() => {
    const getDataAfterTimeout = setTimeout(() => {
      const getProductSuggestion = () => {
        const keyword = product.toLowerCase();
        const filtered = allProducts.filter((entry) => {
          return (
            (entry.title &&
              typeof entry.title === "string" &&
              entry.title.toLowerCase().includes(keyword)) ||
            (entry.desc &&
              typeof entry.desc === "string" &&
              entry.desc.toLowerCase().includes(keyword)) ||
            (entry.exp_date &&
              typeof entry.exp_date === "string" &&
              entry.exp_date.toLowerCase().includes(keyword)) ||
            (entry.category &&
              typeof entry.category === "string" &&
              entry.category.toLowerCase().includes(keyword)) ||
            (entry.tags &&
              Array.isArray(entry.tags) &&
              entry.tags.some((tag) => tag.toLowerCase().includes(keyword)))
          );
        });
        setProductSuggestion(filtered);
      };
      if (!clicked && product.length > 2) {
        getProductSuggestion();
      } else {
        setProductSuggestion([]);
        setClicked(false);
      }

      const getUserSuggestion = () => {
        const keyword = user.toLowerCase();
        const filtered = allUsers.filter((entry) => {
          return (
            (entry.name &&
              typeof entry.name === "string" &&
              entry.name.toLowerCase().includes(keyword)) ||
            (entry.email &&
              typeof entry.email === "string" &&
              entry.email.toLowerCase().includes(keyword))
          );
        });
        setUserSuggestion(filtered);
        console.log(userSuggestion);
      };
      if (!clicked && user.length > 2) {
        getUserSuggestion();
      } else {
        setUserSuggestion([]);
        setClicked(false);
      }

      const getUserProductSuggestion = () => {
        const keyword = userProduct.toLowerCase();
        const filtered = allUserProducts.filter((entry) => {
          return (
            (entry.title &&
              typeof entry.title === "string" &&
              entry.title.toLowerCase().includes(keyword)) ||
            (entry.desc &&
              typeof entry.desc === "string" &&
              entry.desc.toLowerCase().includes(keyword)) ||
            (entry.exp_date &&
              typeof entry.exp_date === "string" &&
              entry.exp_date.toLowerCase().includes(keyword)) ||
            (entry.category &&
              typeof entry.category === "string" &&
              entry.category.toLowerCase().includes(keyword)) ||
            (entry.tags &&
              Array.isArray(entry.tags) &&
              entry.tags.some((tag) => tag.toLowerCase().includes(keyword)))
          );
        });
        setUserProductSuggestion(filtered);
        console.log(userSuggestion);
      };
      if (!clicked && userProduct.length > 2) {
        getUserProductSuggestion();
      } else {
        setUserProductSuggestion([]);
        setClicked(false);
      }
    }, 100);

    return () => clearTimeout(getDataAfterTimeout);
  }, [product, user, userProduct]);

  useEffect(() => {
    setProduct("");
    setUser("");
    setUserProduct("");
  }, [location.pathname]);

  const genReadAllProducts = async () => {
    try {
      const res = await readAllProducts();
      console.log("All Products:", res);
      setAllProducts(res || []);
    } catch (error) {
      console.error("Failed to get all products", error);
    }
  };

  const genReadAllUsers = async () => {
    try {
      const res = await readAllUsers();
      console.log("All Users:", res);
      setAllUsers(res || []);
    } catch (error) {
      console.error("Failed to get all users", error);
    }
  };

  const genReadAllUserProducts = async () => {
    try {
      const res = await readUserProducts(currentUserId);
      console.log("All User Products:", res);
      setAllUserProducts(res || []);
    } catch (error) {
      console.error("Failed to get user products", error);
    }
  };

  const handleClick = (clicked) => {
    setProduct("");
    setUser("");
    setUserProduct("");

    if (clicked.title) {
      console.log("Product clicked:", clicked.title + " id :" + clicked._id);
      setClicked(true);
      navigate(`/dashboard/products/${clicked._id}`);
    } else if (clicked.name) {
      console.log("User clicked:", clicked.name + " id :" + clicked._id);
      setClicked(true);
      navigate(`/dashboard/admin/users/${clicked._id}`);
    } else {
      console.error("Clicked item is neither a product nor a user:", clicked);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    console.log(selectedCategory);
  };

  const handleTagChange = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    console.log(selectedTags);
    
  };

  const filterProducts = () => {
    const keyword = product.toLowerCase();
  
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Tags:", selectedTags);
  
    const filtered = allProducts.filter((entry) => {
      const matchesCategory = selectedCategory ? entry.category === selectedCategory : true;
      const matchesTags = selectedTags.length ? selectedTags.every((tag) => entry.tags.includes(tag)) : true;
      const matchesKeyword =
        (entry.title && typeof entry.title === "string" && entry.title.toLowerCase().includes(keyword)) ||
        (entry.desc && typeof entry.desc === "string" && entry.desc.toLowerCase().includes(keyword)) ||
        (entry.exp_date && typeof entry.exp_date === "string" && entry.exp_date.toLowerCase().includes(keyword));
  
      return matchesCategory && matchesTags && matchesKeyword;
    });
  
    setProductSuggestion(filtered);
    console.log(filtered);
    navigate(`/dashboard/${currentUserId}`, { state: { filteredProducts: filtered } });
  
    setSelectedCategory(null);
    setSelectedTags([]);
    setProductSuggestion([]);
    setUserProductSuggestion([]);
    setUserSuggestion([]);
    setClicked(false);
  };

  return (
    <>
      {storedUser && (
        <div>
          {currentUserIsAdmin ? (
            <>
              <ul>
                {categories &&
                  categories.map((category, index) => (
                    <li key={index}>
                      <button onClick={() => handleCategoryChange(category)}>
                        {category}
                      </button>
                    </li>
                  ))}
              </ul>

              <ul>
                {tags &&
                  tags.map((tag, index) => (
                    <li key={index}>
                      <button onClick={() => handleTagChange(tag)}>
                        {tag}
                      </button>
                    </li>
                  ))}
              </ul>

              <input
                type="text"
                placeholder="Search..."
                value={product || user}
                onChange={(event) => {
                  const value = event.target.value;
                  setProduct(value);
                  setUser(value);
                }}
              />
              {productSuggestion.length > 0 || userSuggestion.length > 0 ? (
                <>
                <div className="suggestion">
                  <ul>
                    {productSuggestion.length > 0 &&
                      productSuggestion.map((currentProduct) => (
                        <li
                          key={currentProduct._id}
                          onClick={() => handleClick(currentProduct)}
                        >
                          {currentProduct.title} - {currentProduct.desc} -
                          Expiration Date:{" "}
                          {new Date(
                            currentProduct.exp_date
                          ).toLocaleDateString()}
                          - Category: {currentProduct.category}- Tags:{" "}
                          {currentProduct.tags}
                        </li>
                      ))}
                    {userSuggestion.length > 0 &&
                      userSuggestion.map((currentUser) => (
                        <li
                          key={currentUser._id}
                          onClick={() => handleClick(currentUser)}
                        >
                          {currentUser.name} - {currentUser.email}
                        </li>
                      ))}
                  </ul>
                </div>
                </>
              ) : (
                productSuggestion.length === 0 &&
                userSuggestion.length === 0 &&
                (product.length > 2 || user.length > 2) && filterProducts === 0 && (
                  <div className="no-results">Not found...</div>
                )
              )}
              <div>
                  <button onClick={filterProducts}>Search</button>
                </div>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search..."
                value={userProduct}
                onChange={(event) => setUserProduct(event.target.value)}
              />
              {userProductSuggestion.length > 0 ? (
                <div className="suggestion">
                  <ul>
                    {userProductSuggestion.map((currentUserProduct) => (
                      <li
                        key={currentUserProduct._id}
                        onClick={() => handleClick(currentUserProduct)}
                      >
                        {currentUserProduct.title} - {currentUserProduct.desc} -
                        Expiration Date:{" "}
                        {new Date(
                          currentUserProduct.exp_date
                        ).toLocaleDateString()}
                        - Category: {currentUserProduct.category}- Tags:{" "}
                        {currentUserProduct.tags}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                userProductSuggestion.length === 0 &&
                userProduct.length > 2 && (
                  <div className="no-results">Not found...</div>
                )
              )}
              <div>
                  <button onClick={filterProducts}>Search</button>
                </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default SearchBar;
