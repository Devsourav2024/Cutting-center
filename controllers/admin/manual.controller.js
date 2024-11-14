const db = require("../../configs/db");

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updateQuery = `UPDATE manual SET status = '${status}' WHERE manual_id = '${id}'`;
    await db.promise().query(updateQuery);
    return res
      .status(200)
      .json({ message: "Status updated successfully", status: 200 });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, status: error.status, data: error.data });
  }
};

module.exports = { update };
