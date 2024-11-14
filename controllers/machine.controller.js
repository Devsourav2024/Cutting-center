const db = require("../configs/db");

const getMachineByMaterialId = async (req, res, next) => {
  const { materialId } = req.query;
  const getColorsByMaterialIdQuery = `SELECT m.machine_id, m.machine_name, ms.material_name, ms.material_id
    FROM material_machine as mm
    LEFT JOIN machines as m ON m.machine_id = mm.machine_id
    LEFT JOIN materials as ms ON ms.material_id = mm.material_id
    WHERE mm.material_id = ?;`;
  try {
    const thickenss = await db
      .promise()
      .query(getColorsByMaterialIdQuery, [materialId]);
    res.status(200).json(thickenss[0]);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  getMachineByMaterialId,
};
