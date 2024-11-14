const db = require("../../configs/db");

const createMaterialMachine = async (req, res) => {
  const { material_id, machine_id } = req.body;
  const insertMaterialMachineQuery = `INSERT INTO material_machine (material_id, machine_id) values(?,?)`;
  try {
    await db
      .promise()
      .query(insertMaterialMachineQuery, [material_id, machine_id]);
    res.status(201).json("data inserted");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
const getByMaterialId = async (req, res) => {
  try {
    const { id } = req.params;
    const retrieveQuery = `SELECT * FROM material_machine WHERE material_id = ? `;
    const materialThickness = await db.promise().query(retrieveQuery, [id]);
    return res.status(200).json(materialThickness[0]);
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
};

const getAll = async (req, res) => {
  const retrieveQuery = `SELECT mm.material_machine_id, mc.machine_name, mc.machine_id, m.material_name, m.material_id
     FROM material_machine as  mm
     LEFT JOIN machines AS mc ON mc.machine_id = mm.machine_id
     LEFT JOIN materials AS m ON m.material_id = mm.material_id`;
  try {
    const machines = await db.promise().query(retrieveQuery);
    return res.status(200).json(machines[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
const update = async (req, res) => {
  try {
    const { material_id, machine_id, material_machine_id } = req.body;
    const updateQuery = `UPDATE material_machine SET material_id = ?, machine_id = ? WHERE material_machine_id = ?`;
    await db
      .promise()
      .query(updateQuery, [material_id, machine_id, material_machine_id]);
    return res.status(200).json({ message: "Update successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteMaterialMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM material_machine WHERE material_machine_id = ?`;
    await db.promise().query(deleteQuery, [id]);
    return res
      .status(200)
      .json({ message: "Material machine deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createMaterialMachine,
  getByMaterialId,
  getAll,
  update,
  deleteMaterialMachine,
};
