const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID to the request object for future use
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.firstName = decoded.firstName;
    req.lastName = decoded.lastName;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed." });
  }
};

module.exports = {
  authenticateUser,
};
