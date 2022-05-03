require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

const app = express();

mongoose.connect("mongodb://localhost:27017/GootalkDB");
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected.");
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

app.listen(8080, () => {
  console.log("Server is running.");
});
