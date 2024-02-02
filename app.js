
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const entryRoutes = require("./src/routes/entryRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/entries", entryRoutes);




module.exports = app;
