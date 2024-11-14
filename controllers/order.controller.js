const db = require("../configs/db");
const nodemailer = require("../helpers/nodemailer.config");
// const { DateTime } = require("luxon");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      paymentId,
      shipping_address,
      billing_address,
      payment_method,
      shipping_method,
    } = req.body;
    console.log("Node re body==>", req.body);

    const createOrderQuery = `INSERT into orders (user_id, payment_id, shipping_method, shipping_address,billing_address, payment_method) VALUES(?,?,?,?,?,?)`;
    const order = await db
      .promise()
      .query(createOrderQuery, [
        Number(userId),
        paymentId,
        shipping_method,
        shipping_address,
        billing_address,
        payment_method,
      ]);
    return res.status(201).json({ order_id: order[0].insertId });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const createManualOrder = async (req, res) => {
  try {
    const { userId } = req;
    // const {
    //   userId,
    //   paymentId,
    //   shipping_address,
    //   payment_method,
    //   shipping_method,
    // } = req.body;
    // const createOrderQuery = `INSERT into orders (user_id, payment_id, shipping_method, shipping_address, payment_method) VALUES(?,?,?,?,?)`;
    // const order = await db
    //   .promise()
    //   .query(createOrderQuery, [
    //     Number(userId),
    //     paymentId,
    //     shipping_method,
    //     shipping_address,
    //     payment_method,
    //   ]);
    const image_link =
      "https://testmymobileapp.com/biswajit-das/cutting-center/node-backend/uploads/" +
      req.file.filename;
    const insertDesign = `INSERT INTO designs (design_link) VALUES(?);`;
    const designUpload = await db.promise().query(insertDesign, [image_link]);
    const insertId = designUpload[0].insertId;
    const insertIntoManual = `INSERT INTO manual(design_id, user_id,status) VALUES(?,?,?)`;
    const manualOrder = await db
      .promise()
      .query(insertIntoManual, [insertId, userId, "ACTIVE"]);
    return res.status(200).json({ status: "Design received" });
  } catch (error) {
    console.log("Error from order: --> ", error.stack);
    return res.status(500).json(error);
  }
};
const manualOrders = async (req, res) => {
  try {
    const retreiveQuery = `SELECT m.manual_id, m.user_id,m.status, d.design_link, d.design_id
     from manual as m
     LEFT JOIN designs as d ON d.design_id = m.design_id
    ORDER BY m.updated_at DESC`;
    const manualOrders = await db.promise().query(retreiveQuery);
    return res.status(200).json(manualOrders[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message, status: "Failed" });
  }
};
const updateOrderItems = async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    const updateQuery = `UPDATE order_items SET order_id = ?,in_cart = false WHERE order_items.in_cart = true and user_id = ? `;
    const response = await db.promise().query(updateQuery, [orderId, userId]);
    return res.status(200).json({ data: response[0] });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateQuery = `UPDATE order_items SET cancelled = true WHERE order_item_id = ?`;
    await db.promise().query(updateQuery, [id]);
    const order_details = await db
      .promise()
      .query("SELECT * FROM order_items  WHERE order_item_id = ?", [id]);

    console.log("order_details==>", order_details[0][0]);
    let user_id = order_details[0][0].user_id;
    const user_details = await db
      .promise()
      .query("SELECT * FROM users  WHERE user_id = ?", [user_id]);
    console.log("user_details==>", user_details[0][0]);
    // return false;

    var d = new Date();

    const options = {
      timeZone: "Asia/Dubai",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const dubaiTime = formatter.format(new Date());

    const isoDate = user_details[0][0].created_at;
    const date = new Date(isoDate);
    const dubaiCreateTime = date.toLocaleString("en-US", options);

    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: "support@thecuttingcenter.com", // Recipient's email
      subject: "Order Cancelled - The Cutting Center",
      html: `<!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <title>Order Cancelled - The Cutting Center</title>
        <style>
            /* Add your custom email styles here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }

            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            h1 {
                color: #333;
            }

            p {
                color: #666;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h2>Order Cancelled</h2>
            <p>Dear Team ,</p>
            <p>This is to inform you that the following order has been canceled:</p>
            <p>Order ID - ${`100` + id}</p>
            <p>Name : ${
              user_details[0][0].first_name + " " + user_details[0][0].last_name
            } </p>
            <p>Date of Order : ${dubaiCreateTime} </p>
            <p>Cancellation Date : ${dubaiTime} </p>
            
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team at support@thecuttingcenter.com.</p>
            <p>Thank you for choosing The Cutting Center.</p>
            <p>Best regards,</p>
            <p>The Cutting Center Team</p>
        </div>
    </body>

    </html>
    `,
      // text: `Click the following link to reset your password: ${`https://testmymobileapp.com/biswajit-das/cutting-center/build/forgot-password?token=${resetToken}`}`,
    };

    const info = await nodemailer.sendMail(mailOptions);

    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const orderItems = async (req, res) => {
  try {
    const { userId } = req.query;
    // console.log("orderItems user_id==>", userId);

    const retreiveQuery = `SELECT m.material_name, t.thickness, oi.selling_price, oi.cancelled, oi.updated_at,  oi.quantity, oi.order_item_id, payments.payment_status, payments.amount, cl.color_name, fn.finish_name
        FROM order_items AS oi
        LEFT JOIN orders ON oi.order_id = orders.order_id 
        LEFT JOIN payments ON orders.payment_id = payments.payment_id
        LEFT JOIN materials AS m ON m.material_id = oi.material_id
        LEFT JOIN thickness AS t ON t.thickness_id = oi.thickness_id
        LEFT JOIN colors AS cl ON cl.color_id = oi.color_id
        LEFT JOIN finish AS fn ON fn.finish_id = oi.finish_id
        where oi.user_id = ? and oi.in_cart = false order by oi.order_item_id desc;`;
    const orders = await db.promise().query(retreiveQuery, [userId]);
    return res.status(200).json(orders[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const orderItemDetails = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    console.log("userId==>", userId);
    console.log("id==>", id);

    const retreiveQuery = `SELECT m.material_name, t.thickness, oi.selling_price, oi.vat_price, oi.actual_price,oi.vat_percentage, oi.quantity,oi.rigid_file,oi.rigid_image, oi.order_item_id,oi.order_id, oi.in_cart, oi.cancelled, oi.order_delivered, oi.created_at,o.shipping_address,o.billing_address, d.design_link, d.circumference, d.height, d.width, u.first_name, u.last_name, u.email, u.contact_number, c.color_name, f.finish_name, payments.amount
        FROM order_items AS oi
        LEFT JOIN orders AS o ON o.order_id = oi.order_id
        LEFT JOIN payments ON o.payment_id = payments.payment_id
        LEFT JOIN materials AS m ON m.material_id = oi.material_id
        LEFT JOIN thickness AS t ON t.thickness_id = oi.thickness_id
        LEFT JOIN designs AS d ON d.design_id = oi.design_id
        LEFT JOIN users AS u ON u.user_id = oi.user_id
        LEFT JOIN colors AS c ON c.color_id = oi.color_id
        LEFT JOIN finish AS f ON f.finish_id = oi.finish_id
        where oi.user_id = ? and order_item_id = ? and in_cart = false;`;
    const order = await db.promise().query(retreiveQuery, [userId, id]);
    return res.status(200).json(order[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const review = async (req, res) => {
  try {
    const { order_item_id, message, rating } = req.body;
    const insertReview = `INSERT INTO order_item_reviews (order_item_id, review, rating) VALUES(?, ?, ?);`;
    const review = await db
      .promise()
      .query(insertReview, [order_item_id, message, rating]);

    const retreiveQuery1 = "SELECT * FROM order_items WHERE order_item_id = ?";
    const orderDetails = await db
      .promise()
      .query(retreiveQuery1, [order_item_id]);
    console.log("orderDetails==>", orderDetails[0][0]);
    const retreiveQuery2 = "SELECT * FROM users WHERE user_id = ?";
    const userDetails = await db
      .promise()
      .query(retreiveQuery2, [orderDetails[0][0].user_id]);
    console.log("userDetails==>", userDetails[0][0]);
    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: "support@thecuttingcenter.com", // Recipient's email
      subject: "Cutting Center Product Review",
      html: `<!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <title>Product Review</title>
        <style>
            /* Add your custom email styles here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }

            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            h1 {
                color: #333;
            }

            p {
                color: #666;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Product Review!</h1>
            <p>Dear Team ,</p>
            <p>A new product review has been submitted on your platform. Below are the details:</p>
            <p>Order ID:  ${`100` + order_item_id}</p>
            <p>Name:  ${
              userDetails[0][0].first_name + " " + userDetails[0][0].last_name
            }</p>
            <p>Email:  ${userDetails[0][0].email}</p>
            <p>Rating:  ${rating}</p>
            <p>Description:  ${message}</p>
           
            
            
            <p>Best regards,</p>
            <p>The Cutting Center Team</p>
        </div>
    </body>

    </html>
    `,
      // text: `Click the following link to reset your password: ${`https://testmymobileapp.com/biswajit-das/cutting-center/build/forgot-password?token=${resetToken}`}`,
    };

    const info = await nodemailer.sendMail(mailOptions);
    return res.status(201).json({ message: "Review created" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const confirmationEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, email, firstName, lastName } = req;
    console.log(userId, email, firstName, lastName);
    const retreiveQuery = "SELECT * FROM orders WHERE order_id = ?";
    const orderDetails = await db.promise().query(retreiveQuery, [id]);
    console.log("orderDetails==>", orderDetails[0][0]);
    const retreiveQuery1 = "SELECT * FROM order_items WHERE order_id = ?";
    const orderItemDetails = await db.promise().query(retreiveQuery1, [id]);
    console.log("orderItemDetails==>", orderItemDetails);
    console.log("orderItemDetails obj==>", orderItemDetails[0]);
    let orderItemsArr = [];
    for (let i = 0; i < orderItemDetails[0].length; i++) {
      orderItemsArr.push("100" + orderItemDetails[0][i].order_item_id);
    }
    console.log("orderItemsArr==>", orderItemsArr);
    let orderIdstr = orderItemsArr.join(" ,");
    console.log("orderIdstr==>", orderIdstr);

    var d = new Date();

    const options = {
      timeZone: "Asia/Dubai",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const dubaiTime = formatter.format(new Date());

    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: email,
      cc: "support@thecuttingcenter.com", // Recipient's email
      // bcc: "sourav.maity@indusnet.co.in", // Recipient's email
      subject: "Order Confirmation - The Cutting Center",
      html: `<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        /* Add your custom email styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }

        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #666;
        }
    </style>
</head>

<body>
    <div class="container">
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for placing an order with The Cutting Center. We are thrilled to serve you!</p>
        <p>Your order details are as follows:</p>
        <ul>
            <li><strong>Order Number:</strong> ${orderIdstr}</li>
            
            <li><strong>Date :</strong> ${dubaiTime}</li>
            
            <li><strong>Shipping Address:</strong> ${
              orderDetails[0][0].shipping_address
                ? orderDetails[0][0].shipping_address
                : "N/A"
            }</li>
        </ul>
        
        <p>If you have any questions about your order or need assistance, please contact our support team at support@thecuttingcenter.com.</p>
        <p>We will notify you once your order has been shipped. You can also track the status of your order through your
            account on our website.</p>
        <p>Thank you for choosing The Cutting Center.</p>
        <p>Best regards,</p>
        <p>The The Cutting Center Team</p>
    </div>
</body>

</html>`,
      // text: `Click the following link to reset your password: ${`https://testmymobileapp.com/biswajit-das/cutting-center/build/forgot-password?token=${resetToken}`}`,
    };
    if (orderDetails[0][0].payment_method != "") {
      const info = await nodemailer.sendMail(mailOptions);
    }

    res.status(200).json({
      message: "Success",
      status: "ok",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
const getItemsByOrderId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderItems = await db
      .promise()
      .query("SELECT * FROM order_items  WHERE order_id = ?", [id]);
    return res.status(200).json(orderItems[0]);
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
};
module.exports = {
  createOrder,
  updateOrderItems,
  orderItems,
  orderItemDetails,
  cancel,
  createManualOrder,
  manualOrders,
  review,
  confirmationEmail,
  getItemsByOrderId,
};
