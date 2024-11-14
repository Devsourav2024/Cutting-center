const nodemailer = require("nodemailer");

// Create a transporter for Office 365
/* const transporter = nodemailer.createTransport({
  service: "hotmail", // Office 365 uses the Hotmail service
  auth: {
    user: "support@thecuttingcenter.com", // Your Office 365 email
    pass: "Wop91781", // App password generated in your Office 365 account
  },
}); */

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "prasun@talash.net",
    pass: "O815pjTIbYX670zE",
  },
});

const sendMail = (mailOptions) => {
  if (mailOptions.to && mailOptions.to != "") {
    console.log("mailOptions", mailOptions);
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "prasun@talash.net",
        pass: "O815pjTIbYX670zE",
      },
    });
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        // console.error('Mail err=>', err);
      } else {
        // console.log('Mail Info=>', info);
      }
    });
  }
};

module.exports = transporter;
