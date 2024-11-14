const nodemailer = require("../helpers/nodemailer.config");

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: email,
      cc: "support@thecuttingcenter.com", // Recipient's email
      subject: "Successful Subscription to The Cutting Center Newsletter",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Add your custom CSS styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        h1 {
            font-size: 24px;
            color: #333333;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            color: #666666;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Successful Subscription to The Cutting Center Newsletter</h1>
        <p>Thank you for subscribing to The Cutting Center Newsletter. You are now part of our community!</p>
        <p>You will receive the latest news, offers, and updates right in your inbox. Stay tuned!</p>
    </div>
</body>
</html>
`,
      // text: `Click the following link to reset your password: ${`https://testmymobileapp.com/biswajit-das/cutting-center/build/forgot-password?token=${resetToken}`}`,
    };

    const info = await nodemailer.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Successfully subscribed to our newsletter!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = {
  subscribe,
};
