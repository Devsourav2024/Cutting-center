const db = require("../../configs/db");
const nodemailer = require("../../helpers/nodemailer.config");

const addToCart = async (req, res) => {
  try {
    const {
      order_id,
      user_id,
      design_id,
      material_id,
      thickness_id,
      color_id,
      finish_id,
      selling_price,
      vat_percentage,
      vat_price,
      actual_price,
      quantity,
      in_cart,
      manual_id,
    } = req.body;
    console.log("REQ BODY: " + JSON.stringify(req.body));
    const insertQuery = `INSERT INTO order_items(order_id, user_id,design_id, material_id,thickness_id,color_id, finish_id,selling_price, actual_price,vat_price, vat_percentage, quantity, in_cart) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const deleteQuery = `DELETE FROM manual WHERE manual_id = ?`;
    await db.promise().query(deleteQuery, [manual_id]);
    const designRetreiveQuery = `SELECT design_link from designs WHERE design_id = ?`;
    const design = await db.promise().query(designRetreiveQuery, [design_id]);

    const userRetreiveQuery = `SELECT email, first_name, last_name from users WHERE user_id = ?`;
    const user = await db.promise().query(userRetreiveQuery, [user_id]);

    const materialRetreiveQuery = `SELECT material_name from materials WHERE material_id = ?`;
    const material = await db
      .promise()
      .query(materialRetreiveQuery, [material_id]);

    const thicknessRetreiveQuery = `SELECT thickness from thickness WHERE thickness_id = ?`;
    const thickness = await db
      .promise()
      .query(thicknessRetreiveQuery, [thickness_id]);
    await db
      .promise()
      .query(insertQuery, [
        null,
        Number(user_id),
        Number(design_id),
        Number(material_id),
        Number(thickness_id),
        color_id ? Number(color_id) : null,
        finish_id ? Number(finish_id) : null,
        Number(selling_price),
        Number(actual_price),
        Number(vat_price),
        Number(vat_percentage),
        Number(quantity),
        in_cart,
      ]);
    const mailOptions = {
      from: "support@thecuttingcenter.com", // Your Office 365 email
      to: user[0][0].email,
      cc: "support@thecuttingcenter.com", // Recipient's email
      subject: "Product Added to Your Cart!",
      html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Product Added to Your Cart!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            h2 {
                color: #333;
            }
        </style>
    </head>
    <body>
       
        <h3>
We've examined the design and made necessary adjustments to your cart. Feel free to update your items accordingly.</h3>
        <h4>Cart Details</h4>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Design</th>
                    <th>Material</th>
                    <th>Thickness</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${user[0][0].first_name + user[0][0].last_name}</td>
                    <td><a href='${design[0][0].design_link}'>Download</a></td>
                    <td>${material[0][0].material_name}</td>
                    <td>${thickness[0][0].thickness}</td>
                    <td>${selling_price}</td>
                    <td>${quantity}</td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
    `,
    };

    const info = await nodemailer.sendMail(mailOptions);
    return res.status(200).json({ status: "OK", message: "Success" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, status: error.status });
  }
};

module.exports = { addToCart };
