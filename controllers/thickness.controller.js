const db = require('../configs/db');

const getThicknessByMaterialId = async(req, res, next)=>{
    const {materialId} = req.query;
    console.log(req)
    const getThicknessByMaterialIdQuery = `SELECT t.thickness_id, t.thickness, m.material_name, m.material_id
    FROM thickness AS t
    JOIN material_thickness AS mt ON t.thickness_id = mt.thickness_id
    JOIN materials AS m ON mt.material_id = m.material_id
    WHERE mt.material_id = ?;`
    try{
    const thickenss = await db.promise().query(getThicknessByMaterialIdQuery, [materialId]);
    res.status(200).json(thickenss[0]);
    }catch(err){
        res.status(500).json({ message: err });
    }
}

module.exports = {
    getThicknessByMaterialId
}