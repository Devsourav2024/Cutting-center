const db = require('../configs/db');

const getFinishByMaterialId = async(req, res, next)=>{
    const {materialId} = req.query;
    const getFinishByMaterialIdQuery = `SELECT f.finish_id, f.finish_name, m.material_name, m.material_id
    FROM finish AS f
    JOIN material_finish AS mf ON f.finish_id = mf.finish_id
    JOIN materials AS m ON mf.material_id = m.material_id
    WHERE mf.material_id = ?;`
    try{
    const thickenss = await db.promise().query(getFinishByMaterialIdQuery, [materialId]);
    res.status(200).json(thickenss[0]);
    }catch(err){
        res.status(500).json({ message: err });
    }
}

module.exports = {
    getFinishByMaterialId
}