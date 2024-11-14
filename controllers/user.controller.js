const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");

const axios = require("axios");
// const sharp = require("sharp");
// const dxf = require("dxf-to-svg");

// const { createCanvas } = require("canvas");
// const DxfParser = require("dxf-parser");
// const svg2img = require("svg2img");

// const profilePic = require("../middlewares/profile_picture_multer.middleware");
const {
  profilePic,
  rigidImage,
  rigidImageFile,
} = require("../middlewares/profile_picture_multer.middleware");
const nodemailer = require("../helpers/nodemailer.config");

require("dotenv").config();

const db = require("../configs/db");

const secretKey = "your-secret-key";
const iv = crypto.randomBytes(16);
function encryptUserId(userId) {
  console.log("IV: ---> ", iv);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(userId, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}
// Generate a random IV (Initialization Vector)

// Encrypt Function
function encrypt(text) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  };
}

function decryptUserId(encryptedUserId) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey);
  let decrypted = decipher.update(encryptedUserId, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const signup = async (req, res) => {
  try {
    /*   const { email, password, confirmPassword, name, contactNumber, address } =
      req.body; */
    const {
      email,
      password,
      confirmPassword,
      first_name,
      last_name,
      // country,
      // city,
      // area,
      // street,
      // pin_code,
      contactNumber,
    } = req.body;

    // Check if the email is already registered
    const existingUser = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser[0].length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.log("password====>", password);
    console.log("confirmPassword====>", confirmPassword);

    /*  if (password != confirmPassword) {
      return res.status(409).json({ error: "Password not matched" });
    } */
    // let address = `${country}, ${city}, ${area}, ${street}, ${pin_code}`;
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const response = await db
      .promise()
      .query(
        "INSERT INTO users (email, password, first_name, last_name, contact_number) VALUES (?, ?, ?, ? , ?)",
        [email, hashedPassword, first_name, last_name, contactNumber]
      );
    /*    const addressInsert = await db
      .promise()
      .query(
        "INSERT INTO address (emirate, city, area, street,pin_code, address, user_id) VALUES (?,?,?,?,?,?,?)",
        [country, city, area, street, pin_code, address, response[0].insertId]
      ); */

    /* const updateUser = await db
      .promise()
      .query("UPDATE users SET billing_address = ? WHERE user_id = ?", [
        addressInsert[0].insertId,
        response[0].insertId,
      ]); */

    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: email, // Recipient's email
      subject: "Welcome to The Cutting Center",
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
            <p>Dear ${first_name} ,</p>
            <p>Thank you for signing up for an account with us. We are excited to have you on board.</p>
            <p>Please login with the following credentials :</p>
            <p>Email: <strong>${email} </strong></p>
            <p>Password: <strong>${password} </strong></p>
            <p>Your account has been successfully created, and you can now start enjoying all the benefits of being a Cutting Center member.</p>
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
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

// User signup
// const signup = (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the email already exists in the database
//     const query = 'SELECT * FROM users WHERE email = ?';
//     db.query(query, [email], async (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, message: 'Failed to create user' });
//       }

//       if (results.length > 0) {
//         return res.status(409).json({ success: false, message: 'Email already exists' });
//       }

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Save the user in the database
//       const insertQuery = 'INSERT INTO Users (email, password) VALUES (?, ?)';
//       db.query(insertQuery, [email, hashedPassword], (err) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ success: false, message: 'Failed to create user' });
//         }

//         res.status(201).json({ success: true, message: 'User created successfully' });
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };
// User login
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const query =
      "SELECT u.*, ( SELECT JSON_OBJECT( 'billing_address_id', u.billing_address,'billing_address', COALESCE(a.address, 'N/A')) FROM address AS a WHERE a.address_id = u.billing_address) AS billing_address_details FROM users AS u WHERE u.email = ?";
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
      const user = results[0];
      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      // Generate a JSON Web Token (JWT)
      const token = jwt.sign(
        {
          userId: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        process.env.JWT_SECRET,
        {
          // expiresIn: "1h",
        }
      );

      res.json({ success: true, token, user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// check if user is logged in or not
const checkIsLogin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    req.userData = decoded;
    const retrieveUserDataQuery = `SELECT * from users where user_id = ?`;
    const user = await db
      .promise()
      .query(retrieveUserDataQuery, [decoded.userId]);
    return res.status(200).send(user[0][0]);
  } catch (error) {
    res.status(401).send("Error: Invalid token");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req;
    const query = `SELECT 
    u.email, u.contact_number, u.first_name, u.last_name, u.created_at,u.trn_no, u.updated_at, u.profile_picture, u.user_id,
    JSON_ARRAYAGG(
            JSON_OBJECT(
                'address_id', address.address_id,
                'address', address.address,
                'country', address.country,
                'city_id', address.city_id,
                'city', address.city,
                'area', address.area,
                'building', address.building,
                'landmark', address.landmark,
                'street', address.street,
                'trn', address.trn,
                'pin_code', address.pin_code
            )
    ) AS addresses,
    JSON_OBJECT(
        'billing_address_id', u.billing_address,
        'billing_address', CONCAT(
            IF(a.building IS NOT NULL AND a.building != '', a.building,  ''),
            IF(a.street IS NOT NULL AND a.street != '', CONCAT(', ', a.street), ''),
            IF(a.area IS NOT NULL AND a.area != '', CONCAT(', ', a.area), ''),
            IF(a.landmark IS NOT NULL AND a.landmark != '', CONCAT(', ', a.landmark), ''),
            IF(a.city IS NOT NULL AND a.city != '', CONCAT(', ', a.city), ''),
            IF(a.country IS NOT NULL AND a.country != '', CONCAT(', ', a.country), ''),
            IF(a.pin_code IS NOT NULL AND a.pin_code != '', CONCAT(', ', a.pin_code), ''),
            IF(a.trn IS NOT NULL AND a.trn != '', CONCAT(', ', a.trn), '')   
        )
    ) AS billing_address_details
FROM
    users as u
LEFT JOIN
    address ON u.user_id = address.user_id
LEFT JOIN
    address AS a ON u.billing_address = a.address_id
WHERE
    u.user_id = ?
GROUP BY u.user_id;
`;
    //const retrieveQuery = `SELECT u.email,a.address, u.contact_number, u.first_name, u.last_name, u.created_at, u.updated_at, u.profile_picture, u.user_id FROM users as u LEFT JOIN address as a ON u.user_id = a.user_id WHERE u.user_id = ?`;
    const user = await db.promise().query(query, [userId]);
    return res.status(200).json(user[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateProfilePicture = async (req, res) => {
  profilePic(req, res, function (err) {
    try {
      if (err) {
        return res.status(500).send(err);
      } else {
        const { userId } = req;
        const updateProfile = `UPDATE users SET  profile_picture = ? WHERE user_id = ?`;
        const image_link =
          "https://thecuttingcenter.com/apiv2/" + req.file.filename;
        console.log("image_link==>", image_link);

        db.query(updateProfile, [image_link, userId], (err, results) => {
          if (err) {
            throw err;
          } else {
            res.status(200).send("Picture Uploaded");
          }
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });
};

const uploadRigidFile = async (req, res) => {
  rigidImage(req, res, function (err) {
    try {
      if (err) {
        return res.status(500).send(err);
      } else {
        //////==================End first code ================//////////////////
        // const scaleFactor = 0.1; // Adjust this factor based on the DXF coordinates
        // let minX = Infinity,
        //   minY = Infinity,
        //   maxX = -Infinity,
        //   maxY = -Infinity;

        // const parser = new DxfParser();
        // const filePath = path.resolve(
        //   __dirname,
        //   `../rigidfile/${req.file.filename}`
        // );
        // // const dxfPath = "path/to/your/file.dxf";
        // const dxfData = fs.readFileSync(filePath, "utf-8");
        // const parsedData = parser.parseSync(dxfData);
        // // console.log("parsedData==>", parsedData);
        // let width = 1000;
        // let height = 1200;
        // const canvas = createCanvas(width, height);
        // const ctx = canvas.getContext("2d");

        // // Set background color
        // // Fill background
        // ctx.fillStyle = "#ffffff";
        // ctx.fillRect(0, 0, 1000, 1000);

        // // Draw a simple red line
        // ctx.strokeStyle = "#ff0000";
        // ctx.lineWidth = 5;
        // ctx.beginPath();
        // ctx.moveTo(50, 50);
        // ctx.lineTo(900, 900);
        // ctx.stroke();

        // // Calculate bounding box
        // let minX = Infinity,
        //   minY = Infinity,
        //   maxX = -Infinity,
        //   maxY = -Infinity;

        // // Find bounding box
        // parsedData.entities.forEach((entity) => {
        //   if (entity.type === "LINE") {
        //     entity.vertices.forEach((vertex) => {
        //       minX = Math.min(minX, vertex.x);
        //       minY = Math.min(minY, vertex.y);
        //       maxX = Math.max(maxX, vertex.x);
        //       maxY = Math.max(maxY, vertex.y);
        //     });
        //   }
        // });

        // // Compute scaling and offsets to fit canvas
        // const dxfWidth = maxX - minX;
        // const dxfHeight = maxY - minY;
        // const scaleX = width / dxfWidth;
        // const scaleY = height / dxfHeight;
        // const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

        // const offsetX = -minX * scale;
        // const offsetY = -minY * scale;

        // parsedData.entities.forEach((entity) => {
        //   if (entity.type === "LINE") {
        //     ctx.beginPath();
        //     const startX = entity.vertices[0].x * scale + offsetX;
        //     const startY = entity.vertices[0].y * scale + offsetY;
        //     const endX = entity.vertices[1].x * scale + offsetX;
        //     const endY = entity.vertices[1].y * scale + offsetY;
        //     console.log(
        //       `Drawing line from (${startX}, ${startY}) to (${endX}, ${endY})`
        //     );
        //     ctx.moveTo(startX, startY);
        //     ctx.lineTo(endX, endY);
        //     ctx.stroke();
        //   }
        // });

        // const buffer = canvas.toBuffer("image/png"); // Convert canvas to PNG buffer
        // console.log("buffer==>", buffer);

        // // fs.writeFileSync("rigidfile/output.jpg", buffer);
        // // console.log("Buffer length:", buffer.length);
        // const outputPath = path.resolve(__dirname, `../rigidfile/output.jpg`);
        // sharp(buffer)
        //   .jpeg({ quality: 90 })
        //   .toFile(outputPath, (err, info) => {
        //     if (err) {
        //       console.error("Error saving JPG:", err);
        //     } else {
        //       console.log("JPG saved successfully:", info);
        //     }
        //   });
        const file_link =
          "https://thecuttingcenter.com/apiv2/" + req.file.filename;
        return res.status(200).json(file_link);
        res.status(200).send("Converted image Uploaded");
        const { userId } = req;
        /* const updateProfile = `UPDATE users SET  profile_picture = ? WHERE user_id = ?`;
        const image_link = "http://143.110.242.57:8116/" + req.file.filename;
        console.log("image_link==>", image_link);

        db.query(updateProfile, [image_link, userId], (err, results) => {
          if (err) {
            throw err;
          } else {
            res.status(200).send("Picture Uploaded");
          }
        }); */
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
const uploadRigidImage = async (req, res) => {
  rigidImageFile(req, res, function (err) {
    try {
      if (err) {
        return res.status(500).send(err);
      } else {
        const image_link =
          "https://thecuttingcenter.com/apiv2/" + req.file.filename;
        return res.status(200).json(image_link);
        // res.status(200).send("Converted image Uploaded");
        // const { userId } = req;
        /* const updateProfile = `UPDATE users SET  profile_picture = ? WHERE user_id = ?`;
        const image_link = "http://143.110.242.57:8116/" + req.file.filename;
        console.log("image_link==>", image_link);

        db.query(updateProfile, [image_link, userId], (err, results) => {
          if (err) {
            throw err;
          } else {
            res.status(200).send("Picture Uploaded");
          }
        }); */
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });
};

function parseDxf(filePath) {
  const dxfData = fs.readFileSync(filePath, "utf-8");
  const parsedData = parser.parseSync(dxfData);
  return parsedData;
}

function drawDxfToCanvas(dxfData, width = 1000, height = 1000) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Set background color
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#000000"; // Set stroke color

  // This is a simplified version. You need to handle each DXF entity type properly.
  dxfData.entities.forEach((entity) => {
    if (entity.type === "LINE") {
      ctx.beginPath();
      ctx.moveTo(entity.vertices[0].x, entity.vertices[0].y);
      ctx.lineTo(entity.vertices[1].x, entity.vertices[1].y);
      ctx.stroke();
    }
    // Handle other entity types (e.g., ARC, CIRCLE, POLYLINE, etc.)
  });

  return canvas;
}

const updatePassword = async (req, res) => {
  try {
    const { userId } = req;
    const { password } = req.body;
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatePassword = `UPDATE users SET password = ? WHERE user_id = ?`;
    await db.promise().query(updatePassword, [hashedPassword, userId]);
    return res.status(200).json({ message: "Password update successfully." });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { first_name, last_name, contact_number, address } = req.body;
    // const { first_name, last_name, contact_number, trn_no } = req.body;

    // Update user profile in the database
    await db
      .promise()
      .query(
        "UPDATE users SET first_name = ?, last_name = ?, contact_number = ? WHERE user_id = ?",
        [first_name, last_name, contact_number, userId]
      );

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating user profile:", error);
    res.status(500).json(error);
  }
};
// Step 2: Generate a JWT token containing the user ID
function generateResetToken(userId) {
  const secretKey = "xfsdsadsfsfdsg"; // Update with a secret key
  const expiresIn = "1h"; // Token expiration time

  return jwt.sign({ userId }, secretKey, { expiresIn });
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const retreiveQuery = `SELECT * FROM users WHERE email = "${email}"`;
    const user = await db.promise().query(retreiveQuery);
    console.log("user==>", user);

    if (user[0].length > 0) {
      const userDetails = user[0];
      // Send the reset password email
      const resetToken = generateResetToken(userDetails[0].user_id);
      console.log("resetToken==>", resetToken);

      const mailOptions = {
        from: "support@thecuttingcenter.com", // Your Office 365 email
        to: userDetails[0].email, // Recipient's email
        // to: "vijit.singh@indusnet.co.in", // Recipient's email
        subject: "Reset Your Password",
        html: `<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
    <style>
        /* Add your custom styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }
        .header {
            background-color: #0074d9;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            background-color: #0074d9;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 5px;
            margin-top: 20px;
            cursor: pointer;
        }
            .ii a[href] {
    color: #f0f0f0;
}
        .footer {
            text-align: center;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password for your account. Click the button below to reset your password.</p>
            <a class="button white-text" href=${`https://thecuttingcenter.com/forgot-password/${resetToken}`} >Reset Password</a>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
            <p>© 2024 The Cutting Center. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
        // text: `Click the following link to reset your password: ${`https://testmymobileapp.com/biswajit-das/cutting-center/build/forgot-password?token=${resetToken}`}`,
      };

      const info = await nodemailer.sendMail(mailOptions);
      return res.status(200).json({
        message: info,
        status: "Password reset email sent! Please check your mail.",
      });
    }
    return res
      .status(404)
      .json({ message: "User not found with this email", status: "failed" });
  } catch (error) {
    console.log("Error sending email 2:", error);
    return res
      .status(500)
      .json({ message: error.message, status: error.status });
  }
};
const changePassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const secretKey = "xfsdsadsfsfdsg";
    const decoded = jwt.verify(token, secretKey);
    console.log("decoded==>", decoded);

    if (decoded.userId) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updatePassword = `UPDATE users SET password = ? WHERE user_id = ?`;
      await db
        .promise()
        .query(updatePassword, [hashedPassword, decoded.userId]);
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    } else {
      throw new Error("Invalid user");
    }
  } catch (error) {
    console.log("wrong block");
    console.log("error msg==>", error.message);

    return res.status(500).json({ message: error.message });
  }
};
const changePasswordNew = async (req, res) => {
  try {
    // const { userId } = req;
    const { userId, password } = req.body;
    // const { password, token } = req.body;
    // const secretKey = "xfsdsadsfsfdsg";
    // const decoded = jwt.verify(token, secretKey);
    // console.log("decoded==>", decoded);
    console.log("userId==>", userId);

    if (userId) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updatePassword = `UPDATE users SET password = ? WHERE user_id = ?`;
      await db.promise().query(updatePassword, [hashedPassword, userId]);
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    } else {
      throw new Error("Invalid user");
    }
  } catch (error) {
    console.log("wrong block");
    console.log("error msg==>", error.message);

    return res.status(500).json({ message: error.message });
  }
};
function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  let result = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
const social_login = async (req, res) => {
  try {
    let resJson = {};
    let error = 0;
    // const now = currentDateTime();
    // const created_at = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    const { access_token } = req.body;
    console.log("access_token==>", access_token);

    let login_type = "google";
    let name = "";
    let first_name = "";
    let last_name = "";
    let name_arr = "";
    let id = "";
    let email = "";
    const apiUrl =
      "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" +
      access_token;

    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          // Add any other headers if required
        },
      })
      .then(async (response) => {
        // console.log("Response--->", response);
        console.log("Google response email--->", response.data.email);
        var resp = response;
        // return false;
        id = response.data.id;
        email = response.data.email;

        // let user_details = await userModel.user_email_exist(email);
        const user_details = await db
          .promise()
          .query("SELECT * FROM users WHERE email = ?", [email]);

        /*  if (user_details[0].length > 0) {
          return res.status(409).json({ error: "Email already exists" });
        } */
        console.log("user_details--->", user_details);
        // return false;
        if (user_details[0].length > 0) {
          console.log("Case 1");
          let user_dtls = await db
            .promise()
            .query("SELECT * FROM users WHERE email = ?", [resp.data.email]);
          console.log("user_dtls==>", user_dtls);
          console.log("user_id==>", user_dtls[0][0].user_id);
          console.log("email==>", user_dtls[0][0].email);
          console.log("first_name==>", user_dtls[0][0].first_name);
          console.log("last_name==>", user_dtls[0][0].last_name);
          const token = jwt.sign(
            {
              userId: user_dtls[0][0].user_id,
              email: user_dtls[0][0].email,
              firstName: user_dtls[0][0].first_name,
              lastName: user_dtls[0][0].last_name,
            },
            process.env.JWT_SECRET,
            {
              // expiresIn: "1h",
            }
          );
          res.json({ success: true, token, user: user_dtls[0] });
          // return false;
        } else {
          console.log("Case 2");
          name = resp.data.name;
          name_arr = name.split(" ");
          console.log("name_arr==>", name_arr);
          // return false;

          first_name = name_arr[0];
          last_name = name_arr[1];
          let userObj = {
            first_name: first_name,
            last_name: last_name,
            email: resp.data.email,
            // social_login_id: id,
            // login_type: ,
            profile_picture: resp.data.picture,
          };
          // let user_id = await userModel.create_social_users(userObj);
          let password = generateRandomString();
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const responsee = await db
            .promise()
            .query(
              "INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
              [email, hashedPassword, first_name, last_name]
            );

          let user_dtls = await db
            .promise()
            .query("SELECT * FROM users WHERE email = ?", [resp.data.email]);
          console.log("user_dtls==>", user_dtls);

          const token = jwt.sign(
            {
              userId: user_dtls[0].user_id,
              email: user_dtls[0].email,
              firstName: user_dtls[0].first_name,
              lastName: user_dtls[0].last_name,
            },
            process.env.JWT_SECRET,
            {
              // expiresIn: "1h",
            }
          );
          res.json({ success: true, token, user: user_dtls[0] });
          /*  const userData = {
            user_id: cryptr.encrypt(user_id[0].id),
            name: response.data.name,
            user_agent: cryptr.encrypt(req.get("User-Agent")),
            sessions: "",
          };
          let user_detail = await userModel.user_profile_social_login(
            user_id[0].id
          );

          const sessionId = Math.random().toString(36).substring(7);
          const token = jwtHelper.signAccessTokenUser(userData); */
          /* res
            .status(200)
            .json({
              status: 1,
              token,
              profile: user_detail,
              message: "Login success",
            })
            .end(); */
        }
      })
      .catch((error) => {
        console.log("catch block--->");
        // Handle errors
        console.error("Error fetching data:", error);
        res
          .status(400)
          .json({
            status: 3,
            message: "User not exist",
          })
          .end();
      });
  } catch (error) {
    console.log("wrong block");
    console.log("error msg==>", error.message);

    return res.status(500).json({ message: error.message });
  }
};
const changePasswordNewUpdate = async (req, res) => {
  try {
    // const { userId } = req;
    // const { password } = req.body;
    const { password, token } = req.body;
    const secretKey = "xfsdsadsfsfdsg";
    const decoded = jwt.verify(token, secretKey);
    console.log("decoded==>", decoded);
    // return false;

    if (decoded.userId) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updatePassword = `UPDATE users SET password = ? WHERE user_id = ?`;
      await db
        .promise()
        .query(updatePassword, [hashedPassword, decoded.userId]);
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    } else {
      throw new Error("Invalid user");
    }
  } catch (error) {
    console.log("wrong block");
    console.log("error msg==>", error.message);

    return res.status(500).json({ message: error.message });
  }
};
const updateBillingAddress = async (req, res) => {
  try {
    const { userId } = req;
    // const { address } = req.body;
    const { address_id, trn } = req.body;
    console.log("address==>", address_id);

    const updateUser = await db
      .promise()
      .query(
        "UPDATE users SET billing_address = ?, trn_no = ? WHERE user_id = ?",
        [address_id, trn, userId]
      );
    return res
      .status(200)
      .json({ message: "Billing address updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  checkIsLogin,
  getUserProfile,
  updateProfilePicture,
  updateUserProfile,
  updatePassword,
  forgotPassword,
  changePassword,
  updateBillingAddress,
  changePasswordNew,
  changePasswordNewUpdate,
  uploadRigidFile,
  uploadRigidImage,
  parseDxf,
  social_login,
};
