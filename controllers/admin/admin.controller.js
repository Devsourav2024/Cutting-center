const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const profilePic = require('../../middlewares/profile_picture_multer.middleware');
require("dotenv").config();
const db = require('../../configs/db');
const moment = require('moment');

const signup = async (req, res) => {
    try {
      const { email, password, first_name, last_name, contact_number, address } =
        req.body;
  
      // Check if the email is already registered
      const existingUser = await db
        .promise()
        .query("SELECT * FROM admin WHERE email = ?", [email]);
      console.log(existingUser[0]);
      if (existingUser[0].length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Insert the new admin into the database
      await db
        .promise()
        .query(
          "INSERT INTO admin (email, password, first_name, last_name, contact_number, address) VALUES (?, ?, ?, ?, ?, ?)",
          [email, hashedPassword, first_name, last_name, contact_number, address]
        );
  
      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      console.error("Error occurred during admin signup:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const login = (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the admin exists in the database
      const query = "SELECT * FROM admin WHERE email = ?";
      db.query(query, [email], async (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to login" });
        }
  
        if (results.length === 0) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid email or password" });
        }
  
        // Compare the provided password with the hashed password in the database
        const admin = results[0];
        const passwordMatched = await bcrypt.compare(password, admin.password);
  
        if (!passwordMatched) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid email or password" });
        }
  
        // Generate a JSON Web Token (JWT)
        const token = jwt.sign({ admin_id: admin.admin_id }, process.env.JWT_SECRET, {
          // expiresIn: "1h",
        });
  
        res.json({ success: true, token, admin });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

// check if admin is logged in or not
const checkIsLogin = async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secret");
    //   req.adminData = decoded;
      const retrieveUserDataQuery = `SELECT * from admin where admin_id = ?`;
      const admin = await db
        .promise()
        .query(retrieveUserDataQuery, [decoded.admin_id]);
      return res.status(200).send(admin[0][0]);
    } catch (error) {
      res.status(401).send("Error: Invalid token");
    }
  };


module.exports = {
    signup,
    login,
    checkIsLogin
}