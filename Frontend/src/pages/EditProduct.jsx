// eslint-disable-next-line no-unused-vars
import React from "react";
import { useCategories } from "../contexts/useCategories";
import { useTags } from "../contexts/useTags";
import {
  readOneProduct,
  updateOneProduct,
  deleteOneProduct,
} from "../functions/api";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import trashBin from "@iconify-icons/akar-icons/trash-bin";

function EditProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const { categories, addCategory, deleteCategory } = useCategories() || {
    categories: [],
  };
  const [newCategory, setNewCategory] = useState("");
  const { tags, addTag, deleteTag } = useTags() || { tags: [] };
  const [newTag, setNewTag] = useState("");
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const userId = user.userId;
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    exp_date: "",
    category: "",
    tags: [],
  });

  useEffect(() => {
    genReadOneProduct();
  }, []);

  const genReadOneProduct = async () => {
    try {
      const res = await readOneProduct(productId);
      console.log("Fetched Product:", res);
      setProduct(res);
      setFormData({
        title: res.title || "",
        desc: res.desc || "",
        exp_date: res.exp_date || "",
        category: res.category || "",
        tags: res.tags || [],
      });
    } catch (error) {
      console.error("Failed to fetch one product", error);
    }
  };

  const handleUpdateOneProduct = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      console.log("Form data before submit:", formData);
      await updateOneProduct(productId, formData);
      console.log("Form data submitted:", formData);
      setMessage("Changes saved successfully!");
      navigate(`/dashboard/products/${productId}`);
    } catch (error) {
      console.error("Failed to update product", error);
      setMessage("Failed to save changes.");
    }
  };

  const handleDeleteProduct = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product permanently?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const product = localStorage.getItem("product");
      const res = await deleteOneProduct(productId, product);
      localStorage.removeItem("product");
      navigate(`/dashboard/${userId}/products`);
      setMessage("Product deleted successfully");
      console.log("Deletion was successful:", res.data);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

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
    <div>
      <h1>Edit Product</h1>
      {message && <p>{message}</p>}
      {product ? (
        <>
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

          {formData.category === "add-new-cat" && (
            <div>
              <input
                type="text"
                value={newCategory}
                onChange={handleNewCategoryChange}
                placeholder="Enter new Category"
              />
              <button type="button" onClick={handleAddCategory}>
                Add
              </button>
            </div>
          )}

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

          <form onSubmit={handleUpdateOneProduct}>
            <label>
              Title:
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
            </label>
            <label>
              Expiration date:
              <input
                type="date"
                value={formData.exp_date}
                onChange={(e) =>
                  setFormData({ ...formData, exp_date: e.target.value })
                }
              />
            </label>
            <button type="submit">Save Changes</button>
          </form>
          <button onClick={handleDeleteProduct}>
            <Icon icon={trashBin} width="24" height="24" />
          </button>
        </>
      ) : (
        <p>There is no product data...</p>
      )}
      <br />
      <Link className="return-arrow" to={`/dashboard/products/${productId}`}>
        &lt;
      </Link>
      <br />
      <Link to={`/dashboard/${userId}`}>Back to dashboard</Link>
    </div>
  );
}

export default EditProduct;
