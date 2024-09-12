require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { MONGOURL } = require("./src/data/keys");

require("./src/models/user");
require("./src/models/product");

app.use(cors());
app.use(express.json());

// Enable CORS with specific options
// const corsOptions = {
//   origin: 'https://benevolent-tulumba-f99ace.netlify.app',
// };

// app.use(cors(corsOptions));

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb");
});

mongoose.connection.on("error", () => {
  console.log("Error !!");
});

app.use(require("./src/routes/auth"));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server is running on", PORT);
});