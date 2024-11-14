const db = require("../../configs/db");

/* const orders = async (req, res) => {
  try {
    const retreiveQuery = `SELECT o.order_id, o.shipping_method, o.shipping_address, o.payment_method, o.created_at, u.user_id, u.first_name, u.last_name,u.email, p.payment_status, p.amount
        FROM orders AS o
        LEFT JOIN users AS u ON u.user_id = o.user_id
        LEFT JOIN payments AS p ON p.payment_id = o.payment_id`;
    const orders = await db.promise().query(retreiveQuery);
    return res.status(200).json(orders[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
}; */
const orders = async (req, res) => {
  try {
    // const { userId } = req.query;
    // console.log("orderItems user_id==>", userId);

    const retreiveQuery = `SELECT m.material_name, t.thickness, oi.selling_price, oi.cancelled, oi.updated_at,  oi.quantity,  payments.payment_status, cl.color_name, fn.finish_name, oi.order_item_id as order_id, orders.shipping_method, orders.shipping_address, orders.payment_method,  orders.created_at, u.user_id, u.first_name, u.last_name,u.email, payments.amount

        FROM order_items AS oi
        LEFT JOIN orders ON oi.order_id = orders.order_id 
        LEFT JOIN users AS u ON u.user_id = orders.user_id
        LEFT JOIN payments ON orders.payment_id = payments.payment_id
        LEFT JOIN materials AS m ON m.material_id = oi.material_id
        LEFT JOIN thickness AS t ON t.thickness_id = oi.thickness_id
        LEFT JOIN colors AS cl ON cl.color_id = oi.color_id
        LEFT JOIN finish AS fn ON fn.finish_id = oi.finish_id
        where  oi.in_cart = false order by oi.order_item_id desc;`;
    const orders = await db.promise().query(retreiveQuery, []);
    return res.status(200).json(orders[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const totalSalePrice = async (req, res) => {
  try {
    const totalSaleAmount = `SELECT SUM(p.amount) AS total_income
        FROM order_items AS oi
        LEFT JOIN orders AS o ON o.order_id = oi.order_id
        LEFT JOIN payments AS p ON p.payment_id = o.payment_id
        WHERE in_cart=false AND cancelled = false
        `;
    const response = await db.promise().query(totalSaleAmount);
    return res.status(200).json(response[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong!", error: error });
  }
};
const totalOrderItems = async (req, res) => {
  try {
    const retreiveQuery = `SELECT COUNT(*) AS total_sales from order_items
        WHERE in_cart=false AND cancelled = false`;
    const totalOrderItems = await db.promise().query(retreiveQuery);
    return res.status(200).json(totalOrderItems[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong!", error: error });
  }
};
const orderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.query;
    console.log(orderId);
    const retreiveQuery = `SELECT m.material_name, t.thickness, oi.price, oi.quantity, oi.order_item_id,oi.order_delivered, oi.cancelled, c.color_name, d.design_link, d.circumference, d.height, d.width, u.user_id, u.first_name, u.last_name, u.email
        FROM order_items AS oi
        LEFT JOIN materials AS m ON m.material_id = oi.material_id
        LEFT JOIN thickness AS t ON t.thickness_id = oi.thickness_id
        LEFT JOIN colors AS c ON c.color_id = oi.color_id
        LEFT JOIN designs AS d ON d.design_id = oi.design_id
        LEFT JOIN users AS u ON u.user_id = oi.user_id
        where oi.in_cart = false;`;
    const getOrderItems = `SELECT m.material_name, t.thickness, oi.price, oi.quantity, oi.order_item_id, oi.in_cart, oi.cancelled, oi.order_delivered, oi.created_at, d.design_link, d.circumference, d.height, d.width, u.address, u.first_name, u.last_name, u.email, u.contact_number, c.color_name, f.finish_name
        FROM order_items AS oi
        LEFT JOIN materials AS m ON m.material_id = oi.material_id
        LEFT JOIN thickness AS t ON t.thickness_id = oi.thickness_id
        LEFT JOIN designs AS d ON d.design_id = oi.design_id
        LEFT JOIN users AS u ON u.user_id = oi.user_id
        LEFT JOIN colors AS c ON c.color_id = oi.color_id
        LEFT JOIN finish AS f ON f.finish_id = oi.finish_id
        WHERE oi.order_id = ? and oi.in_cart = false;`;
    const orders = orderId
      ? await db.promise().query(getOrderItems, [orderId])
      : await db.promise().query(retreiveQuery);
    return res.status(200).json(orders[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderItemId, status } = req.body;
    console.log(orderItemId, status);
    const order_delivered = status === "delivered" ? true : false;
    const cancelled = status === "cancelled" ? true : false;
    const retreiveQuery = `UPDATE order_items SET order_delivered = ?, cancelled = ? WHERE order_item_id =?`;
    const updateOrderItemStatus = await db
      .promise()
      .query(retreiveQuery, [order_delivered, cancelled, orderItemId]);
    res.status(200).json({
      status: "success",
      timestamp: new Date(),
      data: [],
    });
  } catch (error) {
    return error;
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { order_id } = req.params;
    // console.log(orderItemId, status);
    // const status  === "delivered" ? true : false;
    // const cancelled = status === "cancelled" ? true : false;
    const retrieveQuery = `SELECT order_id FROM order_items WHERE order_item_id = ? `;
    const order_details = await db.promise().query(retrieveQuery, [order_id]);
    let orders_id = order_details[0][0].order_id;

    console.log("order_id==>", orders_id);

    console.log("order_details1==>", order_details);
    const retrieveQuery1 = `SELECT * FROM orders WHERE order_id = ? `;
    const order_dtls = await db.promise().query(retrieveQuery1, [orders_id]);
    console.log("order_details2==>", order_dtls);

    // return false;
    const payment_id = order_dtls[0][0]?.payment_id;
    console.log("payment_id==>", payment_id);
    // return false;

    const updateQuery = `UPDATE payments SET payment_status = ? WHERE payment_id =?`;
    const updateOrderItemStatus = await db
      .promise()
      .query(updateQuery, [status, payment_id]);
    return res
      .status(200)
      .json({ message: "Payment status Update successfully." });
  } catch (error) {
    return error;
  }
};

module.exports = {
  orderItemsByOrderId,
  orders,
  totalSalePrice,
  totalOrderItems,
  updateOrderItemStatus,
  updatePaymentStatus,
};
