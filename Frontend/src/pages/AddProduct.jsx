// eslint-disable-next-line no-unused-vars
import React from "react";
import { useCategories } from "../contexts/useCategories";
import { useTags } from "../contexts/useTags";
import { createOneProduct } from "../functions/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import trashBin from "@iconify-icons/akar-icons/trash-bin";

function AddProduct() {
  // const navigate = useNavigate()
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;
  const { categories, addCategory, deleteCategory } = useCategories() || {
    categories: [],
  };
  const [newCategory, setNewCategory] = useState("");
  const { tags, addTag, deleteTag } = useTags() || { tags: [] };
  const [newTag, setNewTag] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    exp_date: undefined,
    img: "",
    tags: [],
    category: "",
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => {
      if (type === "checkbox") {
        if (checked) {
          return { ...prevData, tags: [...prevData.tags, value] };
        } else {
          return {
            ...prevData,
            tags: prevData.tags.filter((tag) => tag !== value),
          };
        }
      } else {
        return { ...prevData, [name]: value };
      }
    });
  };

  const handleCreateOneProduct = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      console.error("Please add a title");
      return;
    }

    try {
      const res = await createOneProduct(userId, formData);

      localStorage.setItem("product", res.product);
      console.log("Product stored in local storage:", res.product);

      const product = res;
      localStorage.setItem("product", JSON.stringify(product));
      console.log("Product stored in local storage:", product._id);

      console.log("Form data submitted:", res);
      setMessage("Product created successfully");
      console.log(message);
    } catch (error) {
      console.error("Register product error:", error);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      addCategory(newCategory);
      setFormData({
        ...formData,
        category: newCategory,
      });
      setNewCategory("");
    }
  };

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      addTag(newTag);
      setFormData({
        ...formData,
        tags: [...formData.tags.filter((tag) => tag !== "add-new-tag"), newTag],
      });
      setNewTag("");
    }
  };

  return (
    <>
      <h2>Add a product</h2>
      {message && <p>{message}</p>}

      <ul>
        <li>
          <button
            onClick={() =>
              handleInputChange({
                target: { name: "category", value: "add-new-cat" },
              })
            }
          >
            +
          </button>
        </li>
        <li>
          <button
            onClick={() =>
              handleInputChange({ target: { name: "category", value: "" } })
            }
          >
            Category
          </button>
        </li>
        {categories.map((category, index) => (
          <li key={index}>
            <button
              onClick={() =>
                handleInputChange({
                  target: { name: "category", value: category },
                })
              }
            >
              {category}
            </button>
            <button onClick={() => deleteCategory(category)}>
              <Icon icon={trashBin} width="24" height="24" />
            </button>
          </li>
        ))}
      </ul>

      <div>
        {tags.map((tag, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="tags"
              value={tag}
              checked={formData.tags.includes(tag)}
              onChange={handleInputChange}
            />
            {tag}
            <button onClick={() => deleteTag(tag)}>
              <Icon icon={trashBin} width="24" height="24" />
            </button>
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            name="tags"
            value="add-new-tag"
            checked={formData.tags.includes("add-new-tag")}
            onChange={handleInputChange}
          />
          +
        </label>

        {formData.tags.includes("add-new-tag") && (
          <div>
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              placeholder="Enter new Tag"
            />
            <button type="button" onClick={handleAddTag}>
              Add
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleCreateOneProduct}>
        {formData.category === "add-new-cat" && (
          <div>
            <input
              type="text"
              value={newCategory}
              onChange={handleNewCategoryChange}
              placeholder="Enter new category"
            />
            <button onClick={handleAddCategory}>Add</button>
          </div>
        )}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title || ""}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="desc"
          placeholder="Description..."
          value={formData.desc || ""}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="exp_date"
          placeholder="Expiration date"
          value={formData.exp_date || ""}
          onChange={handleInputChange}
        />
        <button type="submit">Register</button>
      </form>
      <Link to={`/dashboard/${userId}`}>Return to Dashboard</Link>
    </>
  );
}

export default AddProduct;
