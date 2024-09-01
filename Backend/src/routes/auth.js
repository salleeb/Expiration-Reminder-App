require("dotenv").config({ path: "../../../.env" });
const express = require("express");
const router = express.Router();
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

// Admin & user
router.get("/dashboard/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const users = await User.find();
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const products = await Product.find({ user: userId });
    res.json({users, user, products});
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/user/:userId", async (req, res) => {
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

router.put("/user/:userId", async (req, res) => {
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

router.delete("/user/:userId", async (req, res) => {
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

// Product
// router.get("/dashboard/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const products = await Product.find({ user: userId });
//     res.json(products);
//     console.log(products);
//   } catch (error) {
//     console.error("Error retrieving user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/:userId/add-product", async (req, res) => {
  try {
    const { title, desc, exp_date, img, tags } = req.body;
    const userId = req.params.userId;

    const findUserId = await User.findById(userId);
    if (!findUserId) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!title) {
      return res.status(422).json({ error: "Add all data, please" });
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

module.exports = router;
