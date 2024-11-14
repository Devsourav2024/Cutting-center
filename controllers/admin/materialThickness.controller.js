const db = require("../../configs/db");

const createMaterialThickness = async (req, res) => {
  const { material_id, thickness_id, price, cutting_price } = req.body;
  const insertMaterialThicknessQuery = `INSERT INTO material_thickness (material_id, thickness_id, price, cutting_price) values(?,?,?,?)`;
  try {
    await db
      .promise()
      .query(insertMaterialThicknessQuery, [
        Number(material_id),
        Number(thickness_id),
        Number(price),
        Number(cutting_price),
      ]);
    res.status(201).json("data inserted");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getByMaterialId = async (req, res) => {
  try {
    const { id } = req.params;
    const retrieveQuery = `SELECT t.thickness, t.thickness_id
         FROM material_thickness AS mt 
         LEFT JOIN thickness AS t ON t.thickness_id = mt.thickness_id
         WHERE material_id = ? `;
    const materialThickness = await db.promise().query(retrieveQuery, [id]);
    return res.status(200).json(materialThickness[0]);
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
};
const getAll = async (req, res) => {
  const retrieveQuery = `SELECT mt.material_thickness_id, mt.price, mt.cutting_price,t.thickness, t.thickness_id, m.material_name, m.material_id
     FROM material_thickness as  mt
     LEFT JOIN thickness AS t ON t.thickness_id = mt.thickness_id
     LEFT JOIN materials AS m ON m.material_id = mt.material_id`;
  try {
    const machines = await db.promise().query(retrieveQuery);
    return res.status(200).json(machines[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
const update = async (req, res) => {
  try {
    const {
      material_thickness_id,
      material_id,
      thickness_id,
      price,
      cutting_price,
    } = req.body;
    const updateQuery = `UPDATE material_thickness SET material_id = ?, thickness_id = ?, price = ?, cutting_price = ? WHERE material_thickness_id = ?`;
    await db
      .promise()
      .query(updateQuery, [
        material_id,
        thickness_id,
        price,
        cutting_price,
        material_thickness_id,
      ]);
    return res.status(200).json({ message: "Update successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteMaterialThickness = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM material_thickness WHERE material_thickness_id = ?`;
    await db.promise().query(deleteQuery, [id]);
    return res
      .status(200)
      .json({ message: "Material thickness deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createMaterialThickness,
  getByMaterialId,
  getAll,
  update,
  deleteMaterialThickness,
};
