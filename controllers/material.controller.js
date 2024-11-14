const db = require('../configs/db');

const getAllMaterials = async(req, res)=>{
    const getMaterialsQuery = `SELECT * from materials`;
    const materials = await db.promise().query(getMaterialsQuery);
    return res.status(200).json(materials[0])
}

module.exports = {
    getAllMaterials
}