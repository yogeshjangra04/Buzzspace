require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const refreshRoute = require("./routes/refresh");
const logoutRoute = require("./routes/logout");
const notificationsRoute = require("./routes/notifications");

const app = express();

mongoose.connect("mongodb://localhost:27017/GootalkDB");
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected.");
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/refresh", refreshRoute);
app.use("/api/logout", logoutRoute);
app.use("/api/notifications", notificationsRoute);

app.listen(8080, () => {
  console.log("Server is running.");
});
