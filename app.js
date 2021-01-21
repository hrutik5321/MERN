require("dotenv").config();

const mongoose = require("mongoose");

const express = require("express");
const app = express();

//Mddlewares
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//CONNECTING TO DATABASE
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(() => {
    console.log("Somothing Wrong In Code");
  });

//Adding Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 3000;

//COONECTING TO SERVER
app.listen(port, () => {
  console.log(`App Is Ruuning At Port: ${port}`);
});
