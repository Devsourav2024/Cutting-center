const db = require('../configs/db');

const getColorByMaterialId = async(req, res, next)=>{
    const {materialId} = req.query;
    const getColorsByMaterialIdQuery = `SELECT c.color_id, c.color_name, m.material_name, m.material_id
    FROM colors AS c
    JOIN material_color AS mc ON c.color_id = mc.color_id
    JOIN materials AS m ON mc.material_id = m.material_id
    WHERE mc.material_id = ?;`
    try{
    const thickenss = await db.promise().query(getColorsByMaterialIdQuery, [materialId]);
    res.status(200).json(thickenss[0]);
    }catch(err){
        res.status(500).json({ message: err });
    }
}

module.exports = {
    getColorByMaterialId
}