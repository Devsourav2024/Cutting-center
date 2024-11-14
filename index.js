const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
// import path from "path";
const path = require("path");

const db = require("./configs/db");
const tables = require("./routes/tables.route");
const users = require("./routes/user.route");
const admin = require("./routes/admin.route");
const thickness = require("./routes/thickness.route");
const color = require("./routes/color.route");
const finish = require("./routes/finish.route");
const quote = require("./routes/quote.route");
const cart = require("./routes/cart.route");
const material = require("./routes/material.route");
const payment = require("./routes/payment.route");
const order = require("./routes/order.route");
const faqs = require("./routes/faq.route");
const machine = require("./routes/machine.route");
const percentages = require("./routes/percentages.route");
const address = require("./routes/address.route");
const contactUs = require("./routes/contactUs.route");
const subscribe = require("./routes/subscribe.route");

const app = express();

const PORT = process.env.PORT || 4040;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(
  cors({
    origin: "*",
  })
);
/* const allowedOrigins = [
  "http://thecuttingcenter.com/",
  "https://thecuttingcenter.com/",
  "http://13.126.11.11:4070/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
); */
app.use(express.static(path.join(__dirname, "/ProfilePictures")));
app.use(express.static(path.join(__dirname, "/rigidfile")));
app.use(express.static(path.join(__dirname, "/rigidimage")));
app.use("/table", tables);
app.use("/user", users);
app.use("/admin", admin);
app.use("/thickness", thickness);
app.use("/color", color);
app.use("/finish", finish);
app.use("/material", material);
app.use("/quote", quote);
app.use("/cart", cart);
app.use("/payment", payment);
app.use("/order", order);
app.use("/faq", faqs);
app.use("/machine", machine);
app.use("/percentages", percentages);
app.use("/address", address);
app.use("/contactUs", contactUs);
app.use("/subscribe", subscribe);

app.listen(PORT, async () => {
  console.log(`Listening on port : ${PORT}`);
});
