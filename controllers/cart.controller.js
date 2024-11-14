const db = require("../configs/db");

const addToCart = async (req, res) => {
  try {
    const {
      userId,
      material_id,
      thickness_id,
      color_id,
      finish_id,
      selling_price,
      actual_price,
      vat_price,
      vat_percentage,
      quantity,
      inCart,
      circumference,
      height,
      width,
      design_link,
      rigid_file,
      rigid_image,
      linearmeter,
    } = req.body;
    const cart = inCart === "true" ? true : false;
    // create an image link
    const image_link = design_link;
    const insertDesign = `INSERT INTO designs (design_link, circumference, height, width) VALUES(?,?,?,?);`;
    const insertQuery = `INSERT INTO order_items(order_id, user_id,design_id, material_id,thickness_id,color_id, finish_id, selling_price,actual_price, vat_price, vat_percentage, quantity, in_cart, rigid_file, rigid_image, linear_meters) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?)`;
    const designUpload = await db
      .promise()
      .query(insertDesign, [image_link, circumference, height, width]);
    await db
      .promise()
      .query(insertQuery, [
        null,
        Number(userId),
        designUpload[0].insertId,
        Number(material_id),
        Number(thickness_id),
        color_id ? Number(color_id) : null,
        finish_id ? Number(finish_id) : null,
        selling_price,
        actual_price,
        vat_price,
        vat_percentage,
        Number(quantity),
        cart,
        rigid_file,
        rigid_image,
        linearmeter,
      ]);
    return res.status(201).json("Item added in cart.");
  } catch (err) {
    return res.json({ message: err });
  }
};

const getAllCartItems = async (req, res) => {
  try {
    const { userId } = req;
    const retrieveCartItemsQuery = `SELECT c.color_name, d.design_link, f.finish_name, m.material_name, t.thickness, oi.selling_price,oi.actual_price,oi.vat_price,oi.linear_meters, oi.vat_percentage, oi.quantity, oi.order_item_id, total_price.total_price_sum
        from order_items AS oi
        LEFT JOIN colors AS c ON c.color_id = oi.color_id
        LEFT JOIN designs AS d ON oi.design_id = d.design_id
        LEFT JOIN finish AS f ON oi.finish_id = f.finish_id
        LEFT JOIN materials as m ON oi.material_id = m.material_id
        LEFT JOIN thickness as t ON oi.thickness_id = t.thickness_id
        CROSS JOIN (SELECT SUM(oi.selling_price) AS total_price_sum FROM order_items AS oi WHERE oi.in_cart = true and oi.user_id = ?) AS total_price
        WHERE oi.in_cart = true and oi.user_id = ?`;
    const cartItems = await db
      .promise()
      .query(retrieveCartItemsQuery, [userId, userId]);
    if (cartItems[0].length === 0) {
      return res.status(200).json({ data: [], totalPrice: 0 });
    }
    return res.status(200).send({
      data: cartItems[0],
      totalPrice: Number(cartItems[0][0].total_price_sum),
    });
  } catch (err) {
    console.log("Cart Items: ", err);
    return res.status(500).send(err);
  }
};

const updateCartItemsQuantity = async (req, res) => {
  const {
    order_item_id,
    increased,
    decreased,
    color_name,
    design_link,
    finish_name,
    material_name,
    thickness,
    selling_price,
    actual_price,
    vat_price,
    vat_percentage,
    quantity,
    total_price_sum,
  } = req.body;
  const getDetailsQuery = `SELECT d.height,d.width, d.circumference, m.material_id, t.thickness_id, oi.price, oi.quantity
    from order_items AS oi
    LEFT JOIN designs AS d ON oi.design_id = d.design_id
    LEFT JOIN materials as m ON oi.material_id = m.material_id
    LEFT JOIN thickness as t ON oi.thickness_id = t.thickness_id
    WHERE oi.order_item_id = ?`;
  const details = await db.promise().query(getDetailsQuery, [order_item_id]);
  console.log("details==>", details);

  increased >= 0
    ? (details[0][0].quantity = details[0][0].quantity + increased)
    : decreased >= 0
    ? (details[0][0].quantity = details[0][0].quantity - decreased)
    : null;
  console.log("increased==>", increased);
  const sellingPrice = await calculateQuote(details[0][0]);
  console.log("sellingPrice==>", sellingPrice);
  // const updateOrderItemQuery = `UPDATE order_items SET price = ?, quantity = ? WHERE order_item_id = ?`;
  const updateOrderItemQuery = `UPDATE order_items SET selling_price = ?, price = ?, quantity = ? WHERE order_item_id = ?`;
  console.log("updateOrderItemQuery==>", updateOrderItemQuery);
  console.log("sellingPrice==>", sellingPrice);
  console.log("quantity==>", details[0][0].quantity);
  console.log("order_item_id==>", order_item_id);
  await db
    .promise()
    .query(updateOrderItemQuery, [
      sellingPrice,
      sellingPrice,
      details[0][0].quantity,
      order_item_id,
    ]);
  res.status(200).json({ message: "Update successfully." });
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItemQuery = `DELETE FROM order_items WHERE order_item_id = ?`;
    const response = await db.promise().query(deleteItemQuery, [id]);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const calculateQuote = async (obj) => {
  const { height, width, circumference, material_id, thickness_id, quantity } =
    obj;
  const getMaterialPriceAndCuttingPriceQuery = `SELECT price, cutting_price
    FROM material_thickness
    WHERE material_id =? AND thickness_id =?;`;
  const getMaterialPriceAndCuttingPrice = await db
    .promise()
    .query(getMaterialPriceAndCuttingPriceQuery, [material_id, thickness_id]);
  const h = height / 1000;
  const w = width / 1000;
  const lm = circumference / 1000;

  const totalSqrMtrs = Number((h * w).toFixed(2));
  const totalCuttingSqrMtrs = Number((totalSqrMtrs * quantity).toFixed(2));
  const sheetCostPerSqrMtr = Number(
    getMaterialPriceAndCuttingPrice[0][0].price
  );
  const sheetCuttingCostPerSqrMtr = Number(
    getMaterialPriceAndCuttingPrice[0][0].cutting_price
  );
  let totalSheetCost =
    Math.floor(totalCuttingSqrMtrs * sheetCostPerSqrMtr * 100) / 100;
  //totalSheetCost = Math.floor(totalSheetCost * 100) / 100;
  const totalSheetCuttingCost = lm * quantity * sheetCuttingCostPerSqrMtr;

  const safetyPercentage = 0.1;
  const profitPercentage = 0.15;
  const vatPercentage = 0.05;

  const marginOfSafety = Number((totalSheetCost * safetyPercentage).toFixed(2));

  const totalCost = totalSheetCost + totalSheetCuttingCost + marginOfSafety;

  const profit = Math.floor(totalCost * profitPercentage * 100) / 100;

  const taxableValue = totalCost + profit;

  const vat = Math.round(taxableValue * vatPercentage * 100) / 100;

  const sellingPrice = Math.round((taxableValue + vat) * 100) / 100;
  return sellingPrice;
};

module.exports = {
  addToCart,
  getAllCartItems,
  updateCartItemsQuantity,
  deleteCartItem,
};
