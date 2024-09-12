require("dotenv").config();
const express = require("express");
const router = express.Router();
const webpush = require("web-push");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Product = mongoose.model("Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  invalidatedTokens,
  isTokenInvalidated,
  invalidateToken,
  verifyToken,
} = require("../middleware/tokenManager");

// User
router.get("/register", (req, res) => {
  res.send("hello");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  console.log(req.body);

  if (!email || !password || !name || !confirm_password) {
    return res.status(422).json({ error: "Add all data, please" });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedpw) => {
      User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "User already exists with that email" });
        }
        const user = new User({
          email,
          password: hashedpw,
          confirm_password: hashedpw,
          name,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "New user registred!" });
            console.log(user.email);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((match) => {
        if (match) {
          const payload = {
            _id: savedUser._id,
            admin: savedUser.admin,
          };

          const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
          res.json({
            token: token,
            userId: savedUser._id,
            admin: savedUser.admin,
          });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

const login = require("../middleware/tokenManager");

router.get("/protected", verifyToken, (req, res) => {
  res.send("hello");
});

router.delete("/logout", (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");

    if (isTokenInvalidated(token)) {
      return res.status(401).send("Token has already been invalidated");
    }

    invalidateToken(token);

    res.clearCookie("token");

    res.send("Logout successful");
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.get("/dashboard/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const { name, email } = req.body;
    console.log(req.body);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }
    console.log(name + " " + email + " " + userId);
    const updatedUser = await user.save();
    res.json({ message: "User information updated", user: updatedUser });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin
router.get("/dashboard/admin/users", async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ error: "Users not found" });
    }
    res.json({ users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/dashboard/admin/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/dashboard/admin/users/edit/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const { name, email } = req.body;
    console.log(req.body);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }
    console.log(name + " " + email + " " + userId);
    const updatedUser = await user.save();
    res.json({ message: "User information updated", user: updatedUser });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/dashboard/admin/products", async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({ error: "Products not found" });
    }
    res.json({ products });
  } catch (error) {
    console.error("Error retrieving products", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/dashboard/admin/:userId/my_products", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user || !user.admin) {
      return res
        .status(403)
        .json({ error: "Access denied. User is not an admin." });
    }

    const products = await Product.find({ user: userId });

    if (products.length === 0) {
      return res.status(404).json({ error: "Admin products not found" });
    }

    res.json({ products });
  } catch (error) {
    console.error("Error retrieving admin products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Products
router.post("/:userId/add-product", async (req, res) => {
  try {
    const { title, desc, exp_date, img, tags } = req.body;
    const userId = req.params.userId;
    const findUserId = await User.findById(userId);

    if (!findUserId) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!title) {
      return res.status(422).json({ error: "Add a title, please" });
    }

    const product = new Product({
      user: userId,
      title,
      desc,
      exp_date,
      img,
      tags,
    });

    await product.save();
    res.json({ message: "New product registered!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save the product" });
  }
});

router.patch("/dashboard/products/edit/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    const { title, desc, exp_date } = req.body;
    console.log(req.body);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (title !== undefined) {
      product.title = title;
    }

    if (desc !== undefined) {
      product.desc = desc;
    }

    if (exp_date !== undefined) {
      product.exp_date = exp_date;
    }
    console.log(title + " " + desc + " " + exp_date + " " + productId);
    const updatedproduct = await product.save();
    res.json({
      message: "Product information updated",
      product: updatedproduct,
    });
  } catch (error) {
    console.error("Error retrieving Product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/dashboard/:userId/my_products", async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = await Product.find({ user: userId });

    if (!products) {
      return res.status(404).json({ error: "User products not found" });
    }

    res.json({ products });
  } catch (error) {
    console.error("Error retrieving user products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/dashboard/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/dashboard/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    await Product.findByIdAndDelete(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Notifications
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:you@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

router.post("/subscribe", (req, res) => {
  const subscription = req.body;
  global.subscription = subscription;
  res.status(201).json({});
});

const sendNotification = (subscription, data) => {
  webpush
    .sendNotification(subscription, data)
    .then((response) => console.log("Push Notification Sent:", response))
    .catch((error) => console.error("Push Notification Error:", error));
};

router.post("/trigger-push", (req, res) => {
  const payload = JSON.stringify({
    title: "Product Expiring Soon",
    body: "One of your products is about to expire!",
  });

  sendNotification(global.subscription, payload);
  res.status(200).json({ message: "Notification sent" });
});

module.exports = router;
