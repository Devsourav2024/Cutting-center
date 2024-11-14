const db = require("../../configs/db");

const createMachine = async (req, res) => {
  const { machineName } = req.body;
  const insertMachineQuery = `INSERT INTO machines (machine_name) values(?)`;
  try {
    await db.promise().query(insertMachineQuery, [machineName]);
    res.status(201).json("data inserted");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
const machines = async (req, res) => {
  const retrieveQuery = `SELECT * FROM machines`;
  try {
    const machines = await db.promise().query(retrieveQuery);
    return res.status(200).json(machines[0]);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
const update = async (req, res) => {
  try {
    const { machine_name, machine_id } = req.body;
    const updateQuery = `UPDATE machines SET machine_name = ? WHERE machine_id = ?`;
    await db.promise().query(updateQuery, [machine_name, machine_id]);
    return res.status(200).json({ message: "Update successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM machines WHERE machine_id = ?`;
    await db.promise().query(deleteQuery, [id]);
    return res.status(200).json({ message: "Machine deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports = {
  createMachine,
  machines,
  update,
  deleteMachine,
};
