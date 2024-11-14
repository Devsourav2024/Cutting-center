const nodemailer = require("../helpers/nodemailer.config");

const contact = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, companyName, message } = req.body;
    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: "support@thecuttingcenter.com", // Recipient's email
      subject: "Contact Us Form Submission",
      html: `<!DOCTYPE html>
<html>
<body>
    <div style="background-color: #f4f4f4; padding: 20px;">
        <h2>Contact Us Form Submission</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${mobileNumber}</p>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    </div>
</body>

</html>`,
    };
    const mailOptions1 = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: email, // Recipient's email
      cc: "support@thecuttingcenter.com", //
      subject: "Thank You for Contacting Us",
      html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Global styles */
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }

        /* Container styles */
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        /* Header styles */
        .header {
            background-color: #0074d9;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            border-radius: 5px 5px 0 0;
        }

        /* Content styles */
        .content {
            padding: 20px;
            font-size: 16px;
        }

        /* Signature styles */
        .signature {
            font-weight: bold;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="content">
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as
                possible.</p>
            <p><strong>Your Contact Details:</strong></p>
            <ul>
                <li><strong>Full Name:</strong> ${fullName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Contact Number:</strong> ${mobileNumber}</li>
                <li><strong>Company Name:</strong> ${companyName}</li>
            </ul>
            <p>Your Message:</p>
            <p>${message}</p>
            <p>Thank you for considering our services.</p>
            <p class="signature">Sincerely,<br>The Cutting Center</p>
        </div>
    </div>
</body>

</html>`,
    };

    const info = await nodemailer.sendMail(mailOptions);
    const info1 = await nodemailer.sendMail(mailOptions1);
    return res
      .status(200)
      .json({ message: "Thank you for contacting us.", status: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error, status: "error" });
  }
};

module.exports = {
  contact,
};
