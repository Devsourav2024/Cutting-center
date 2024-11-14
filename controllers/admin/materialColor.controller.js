const db = require('../../configs/db');

const createMaterialColor = async(req, res)=>{
    const {material_id, color_id} = req.body;
    const insertMaterialColorQuery = `INSERT INTO material_color (material_id, color_id) values(?,?)`;
    try{
        await db.promise().query(insertMaterialColorQuery, [material_id, color_id]);
        res.status(201).json("data inserted");
    }catch(err){
        res.status(500).json({ error: err });
    }
}
const getByMaterialId = async(req, res)=>{
    try {
        const {id} = req.params;
        const retrieveQuery = `SELECT * FROM material_color WHERE material_id = ? `;
        const materialThickness = await db.promise().query(retrieveQuery, [id]);
        return res.status(200).json(materialThickness[0]);
    } catch (error) {
        return res.status(500).json("Something went wrong!");
        
    }
}
const getAll = async(req, res)=>{
    const retrieveQuery =  `SELECT mc.material_color_id, c.color_name,c.color_id, m.material_name, m.material_id
     FROM material_color as  mc
     LEFT JOIN colors AS c ON c.color_id = mc.color_id
     LEFT JOIN materials AS m ON m.material_id = mc.material_id`;
    try{
        const machines = await db.promise().query(retrieveQuery);
        return res.status(200).json(machines[0]);
    }catch(error){
        return res.status(500).json({message: "Something went wrong"});
    }
}
const update = async(req, res)=>{
    try {
     const {material_id, color_id, material_color_id} = req.body;
     const updateQuery = `UPDATE material_color SET material_id = ?, color_id = ? WHERE material_color_id = ? `;
     await db.promise().query(updateQuery, [material_id, color_id, material_color_id]);
     return res.status(200).json({message: "Update successfully."});
    } catch (error) {
     return res.status(500).json({message: "Something went wrong"});
    }
 
 }

 const deleteMaterialColor = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteQuery = `DELETE FROM material_color WHERE material_color_id = ?`;
        await db.promise().query(deleteQuery, [id]);
        return res.status(200).json({message:"Material color deleted successfully."});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
        
    }
}

module.exports = {
    createMaterialColor,
    getByMaterialId,
    getAll,
    update,
    deleteMaterialColor
}