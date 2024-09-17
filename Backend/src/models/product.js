const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
  },
  exp_date: {
    type: Date,
  },
  img: {
    type: String,
  },
  tags: {
    type: [String],
  },
  category: {
    type: String,
  },
});

mongoose.model("Product", ProductSchema);
