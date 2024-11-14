const db = require("../configs/db");

exports.address = async (req, res) => {
  const address = `CREATE TABLE IF NOT EXISTS address (
    address_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    emirate VARCHAR(255),
    city VARCHAR(255),
    area VARCHAR(255),
    street VARCHAR(255),
    building VARCHAR(255),
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`;
  try {
    await db.promise().query(address);
    return res
      .status(200)
      .json({ message: "Address table created successfully." });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createUsers = async (req, res) => {
  // -- Table: users
  const users = `CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    contact_number VARCHAR(20),
    billing_address BIGINT,
    FOREIGN KEY (billing_address) REFERENCES addresses(address_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`;
  try {
    await db.promise().query(users);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
exports.admin = async (req, res) => {
  // -- Table: users
  const users = `CREATE TABLE IF NOT EXISTS admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    contact_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`;
  try {
    await db.promise().query(users);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
exports.createMaterials = async (req, res) => {
  // -- Table: Materials
  const materials = `CREATE TABLE  IF NOT EXISTS materials (
    material_id INT PRIMARY KEY AUTO_INCREMENT,
    material_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;
  try {
    await db.promise().query(materials);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
exports.createThickness = async (req, res) => {
  // -- Table: Machines
  const thickness = `CREATE TABLE  IF NOT EXISTS thickness (
      thickness_id INT PRIMARY KEY AUTO_INCREMENT,
      thickness INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`;
  try {
    await db.promise().query(thickness);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createColors = async (req, res) => {
  const colors = `CREATE TABLE  IF NOT EXISTS colors (
    color_id INT PRIMARY KEY AUTO_INCREMENT,
    color_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;
  try {
    await db.promise().query(colors);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createFinish = async (req, res) => {
  const finish = `CREATE TABLE  IF NOT EXISTS finish (
    finish_id INT PRIMARY KEY AUTO_INCREMENT,
    finish_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;
  try {
    await db.promise().query(finish);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createMachines = async (req, res) => {
  // -- Table: Machines
  const machines = `CREATE TABLE  IF NOT EXISTS machines (
    machine_id INT PRIMARY KEY AUTO_INCREMENT,
    machine_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;
  try {
    await db.promise().query(machines);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createMaterialThickess = async (req, res) => {
  const material_thickness = `CREATE TABLE  IF NOT EXISTS material_thickness (
    material_thickness_id INT PRIMARY KEY AUTO_INCREMENT,
    material_id INT,
    thickness_id INT,
    price DECIMAL(10, 2),
    cutting_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (thickness_id) REFERENCES thickness(thickness_id),
    FOREIGN KEY (material_id) REFERENCES materials(material_id)
    );`;
  try {
    await db.promise().query(material_thickness);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createMaterialColors = async (req, res) => {
  const material_color = `CREATE TABLE  IF NOT EXISTS material_color (
    material_color_id INT PRIMARY KEY AUTO_INCREMENT,
    material_id INT,
    color_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (color_id) REFERENCES colors(color_id),
FOREIGN KEY (material_id) REFERENCES materials(material_id)
    );`;
  try {
    await db.promise().query(material_color);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createMaterialFinish = async (req, res) => {
  const material_finish = `CREATE TABLE  IF NOT EXISTS material_finish (
    material_finish_id INT PRIMARY KEY AUTO_INCREMENT,
    material_id INT,
    finish_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (finish_id) REFERENCES finish(finish_id),
FOREIGN KEY (material_id) REFERENCES materials(material_id)
    );`;
  try {
    await db.promise().query(material_finish);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createMaterialMachine = async (req, res) => {
  const material_machine = `CREATE TABLE  IF NOT EXISTS material_machine (
    material_machine_id INT PRIMARY KEY AUTO_INCREMENT,
    material_id INT,
    machine_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_id) REFERENCES machines(machine_id),
FOREIGN KEY (material_id) REFERENCES materials(material_id)
    );`;
  try {
    await db.promise().query(material_machine);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createDesigns = async (req, res) => {
  // -- Table: designs
  const designs = `CREATE TABLE  IF NOT EXISTS designs (
    design_id INT PRIMARY KEY AUTO_INCREMENT,
    design_link varchar(255),
    circumference DECIMAL(10, 2),
    height DECIMAL(10, 2),
    width DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`;
  try {
    await db.promise().query(designs);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createPayments = async (req, res) => {
  // -- Table: Payments
  const payments = `CREATE TABLE IF NOT EXISTS payments (
      payment_id INT PRIMARY KEY AUTO_INCREMENT,
      order_reference VARCHAR(255),
      amount DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      payment_status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending'
    );`;
  try {
    await db.promise().query(payments);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createOrders = async (req, res) => {
  // -- Table: Orders
  const orders = `CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    payment_id INT,
    shipping_method VARCHAR(100),
    shipping_address VARCHAR(255),
    billing_address VARCHAR(255),
    payment_method VARCHAR(100),
    delivery_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
  );`;
  try {
    await db.promise().query(orders);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createOrderItems = async (req, res) => {
  // -- Table: OrderItems
  const orderItems = `CREATE TABLE  IF NOT EXISTS order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    user_id INT,
    design_id INT,
    material_id INT,
    thickness_id INT,
    color_id INT,
    finish_id INT,
    selling_price DECIMAL(10, 2),
    actual_price DECIMAL(10, 2),
    vat_price DECIMAL(10, 2),
    vat_percentage DECIMAL(10, 2),
    quantity INT,
    order_delivered BOOLEAN DEFAULT false,
    cancelled BOOLEAN DEFAULT false,
    in_cart BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (design_id) REFERENCES designs(design_id),
    FOREIGN KEY (material_id) REFERENCES materials(material_id),
    FOREIGN KEY (thickness_id) REFERENCES thickness(thickness_id),
    FOREIGN KEY (color_id) REFERENCES colors(color_id),
    FOREIGN KEY (finish_id) REFERENCES finish(finish_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);`;
  try {
    await db.promise().query(orderItems);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createRefunds = async (req, res) => {
  const refunds = `CREATE TABLE IF NOT EXISTS refunds (
        refund_id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT,
        amount DECIMAL(10, 2),
        refunded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
      );`;
  try {
    await db.promise().query(refunds);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createOrderItemReview = async (req, res) => {
  const orderItemReview = `CREATE TABLE IF NOT EXISTS order_item_reviews(
    order_item_review_id INT PRIMARY KEY AUTO_INCREMENT,
    order_item_id INT,
    review TEXT,
    rating TINYINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id)
  )`;
  try {
    await db.promise().query(orderItemReview);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createPercentageTable = async (req, res) => {
  const percentages = `CREATE TABLE IF NOT EXISTS percentages(
    percentage_id INT PRIMARY KEY AUTO_INCREMENT,
    percentage_name VARCHAR(100),
    percentage DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;
  try {
    await db.promise().query(percentages);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.charges = async (req, res) => {
  const charges = `CREATE TABLE IF NOT EXISTS charges(
    charges_id INT PRIMARY KEY AUTO_INCREMENT,
    charges_name VARCHAR(100),
    charges DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;
  try {
    await db.promise().query(charges);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.createFaqTable = async (req, res) => {
  const faqsTable = `CREATE TABLE IF NOT EXISTS faqs(
    faq_id INT PRIMARY KEY AUTO_INCREMENT,
    faq_question VARCHAR(255),
    faq_answer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;
  try {
    await db.promise().query(faqsTable);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.manualOrder = async (req, res) => {
  const faqsTable = `CREATE TABLE IF NOT EXISTS manual(
    manual_id INT PRIMARY KEY AUTO_INCREMENT,
    design_id INT,
   user_id INT,
    status VARCHAR(100),
    FOREIGN KEY (design_id) REFERENCES designs(design_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`;
  try {
    await db.promise().query(faqsTable);
    return res.status(200).json({ message: "Tables are created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
