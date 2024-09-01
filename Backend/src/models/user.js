const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  confirm_password: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  }
});

mongoose.model("User", UserSchema);
