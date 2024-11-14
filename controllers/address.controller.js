const db = require("../configs/db");
const nodemailer = require("../helpers/nodemailer.config");
exports.addAddress = async (req, res) => {
  try {
    // const { address, country, city, area, street, pin_code } = req.body;
    const {
      country,
      city,
      area,
      building,
      landmark,
      street,
      pin_code,
      trn,
      city_id,
    } = req.body;
    const { userId } = req;
    const response = await db
      .promise()
      .query(
        "INSERT INTO address (country, city, area, street,pin_code, trn, user_id, building, landmark, city_id) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          country,
          city,
          area,
          street,
          pin_code,
          trn,
          userId,
          building,
          landmark,
          city_id,
        ]
      );
    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.contactUs = async (req, res) => {
  try {
    const { name, email, mobile, subject, message, contact_type } = req.body;
    // const { userId } = req;
    const response = await db
      .promise()
      .query(
        "INSERT INTO contact_us (name, email, mobile, subject, message) VALUES (?,?,?,?,?)",
        [name, email, mobile, subject, message]
      );
    let subjectss = "";
    if (contact_type == "book_meeting") {
      subjectss = "Thank You for meeting booking | Cutting center";
    } else {
      subjectss = "Thank You for Contacting Us | Cutting center";
    }
    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: email, // Recipient's email
      subject: subjectss,
      html: `<!DOCTYPE html>
      <html>
  
      <head>
          <meta charset="utf-8">
          <title>Welcome to The Cutting Center</title>
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
              <h1>Welcome to The Cutting Center!</h1>
              <p>Dear ${name} ,</p>
              <p>Thank you for reaching out to us! We have received your message and our team is currently reviewing it. One of our representatives will get back to you within 48 hours to address your inquiry.</p>
             
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
    let subjects = "";
    if (contact_type == "book_meeting") {
      subjects = "Cutting center | Meeting booked";
    } else {
      subjects = "Cutting center | Contact Us";
    }
    const mailOptionss = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: "support@thecuttingcenter.com", // Recipient's email
      subject: subjects,
      html: `<!DOCTYPE html>
      <html>
  
      <head>
          <meta charset="utf-8">
          <title>Welcome to The Cutting Center</title>
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
              <h1>Welcome to The Cutting Center!</h1>
              <p>Dear Team ,</p>
               <h4>Contact Us details:</h4>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${mobile}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message}</p>
             
              <p>Thank you for choosing The Cutting Center.</p>
              <p>Best regards,</p>
              <p>The Cutting Center Team</p>
          </div>
      </body>
  
      </html>
      `,
      // text: `Click the following link to reset your password: ${`https://testmymobileapp.com/biswajit-das/cutting-center/build/forgot-password?token=${resetToken}`}`,
    };

    const infos = await nodemailer.sendMail(mailOptionss);
    let success_msg = "";
    if (contact_type == "book_meeting") {
      success_msg = "Thank You for Booking Your Meeting!";
    } else {
      success_msg = "Thank You for Contacting Us!";
    }
    return res.status(200).json({ message: success_msg });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const retreiveQuery = `SELECT *
     from city
    ORDER BY name ASC`;
    const cities = await db.promise().query(retreiveQuery);
    return res.status(200).json(cities[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message, status: "Failed" });
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const { city_id } = req.params;
    const districts = await db
      .promise()
      .query("SELECT * FROM district  WHERE city_id = ?", [city_id]);
    return res.status(200).json(districts[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message, status: "Failed" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const {
      address_id,
      address,
      country,
      city,
      area,
      street,
      building,
      landmark,
      pin_code,
      trn,
    } = req.body;
    const { userId } = req;
    const response = await db
      .promise()
      .query(
        "UPDATE address SET address = ?,emirate = ?,city = ?,area = ?,street = ?,pin_code = ?,building = ?,landmark = ?,trn = ? where address_id = ? and user_id = ?",
        [
          address,
          country,
          city,
          area,
          street,
          pin_code,
          building,
          landmark,
          trn,
          address_id,
          userId,
        ]
      );
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    console.log("REQUEST: " + req.params);
    const { id } = req.params;
    const { userId } = req;
    await db
      .promise()
      .query("DELETE FROM address WHERE address_id = ? and user_id = ?", [
        id,
        userId,
      ]);
    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
