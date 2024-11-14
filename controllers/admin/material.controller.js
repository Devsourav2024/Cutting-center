const db = require('../../configs/db');

const createMaterial = async(req, res)=>{
    const {material_name} = req.body;
    const insertMaterialQuery = `INSERT INTO materials (material_name) values(?)`;
    try{
        await db.promise().query(insertMaterialQuery, [material_name]);
        res.status(201).json("data inserted");
    }catch(err){
        res.status(500).json({ error: err });
    }
}
const getAllMaterials = async(req, res)=>{
    const getMaterialsQuery = `SELECT * from materials`;
    const materials = await db.promise().query(getMaterialsQuery);
    return res.status(200).json(materials[0])
}
const update = async(req, res)=>{
    try {
     const {material_name, material_id} = req.body;
     const updateQuery = `UPDATE materials SET material_name = ? WHERE material_id = ?`;
     await db.promise().query(updateQuery, [material_name, material_id]);
     return res.status(200).json({message: "Update successfully."});
    } catch (error) {
     return res.status(500).json({message: "Something went wrong"});
    }
 
 }
 const deleteMaterial = async(req, res)=>{
     try {
         const {id} = req.params;
         const deleteQuery = `DELETE FROM materials WHERE material_id = ?`;
         await db.promise().query(deleteQuery, [id]);
         return res.status(200).json({message:"Machine deleted successfully."});
     } catch (error) {
         return res.status(500).json({message:"Something went wrong"});
         
     }
 }
module.exports = {
    createMaterial,
    getAllMaterials,
    update,
    deleteMaterial
}