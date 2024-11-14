const db = require("../../configs/db");

const design = async (req, res) => {
  try {
    const { id } = req.params;
    const retreiveQuery = `SELECT * FROM designs WHERE design_id = ?`;
    const design = await db.promise().query(retreiveQuery, [id]);
    return res.status(200).json(design[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, status: error.status });
  }
};
const update = async (req, res) => {
  try {
    const { design_id, height, width, circumference } = req.body;
    const updateQuery = `UPDATE designs SET circumference = ?, height = ?, width = ? WHERE design_id = ?`;
    const updatedDesign = await db
      .promise()
      .query(updateQuery, [circumference, height, width, design_id]);
    return res
      .status(200)
      .json({ message: "Design details updated", status: "Success" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, status: error.status });
  }
};

module.exports = {
  design,
  update,
};
