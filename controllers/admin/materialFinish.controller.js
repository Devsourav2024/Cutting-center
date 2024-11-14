const db = require('../../configs/db');

const createMaterialFinish = async(req, res)=>{
    const {material_id, finish_id} = req.body;
    const insertMaterialFinishQuery = `INSERT INTO material_finish (material_id, finish_id) values(?,?)`;
    try{
        await db.promise().query(insertMaterialFinishQuery, [material_id, finish_id]);
        res.status(201).json("data inserted");
    }catch(err){
        res.status(500).json({ error: err });
    }
}
const getByMaterialId = async(req, res)=>{
    try {
        const {id} = req.params;
        const retrieveQuery = `SELECT * FROM material_finish WHERE material_id = ? `;
        const materialThickness = await db.promise().query(retrieveQuery, [id]);
        return res.status(200).json(materialThickness[0]);
    } catch (error) {
        return res.status(500).json("Something went wrong!");
        
    }
}
const getAll = async(req, res)=>{
    const retrieveQuery =  `SELECT mf.material_finish_id, f.finish_name,f.finish_id, m.material_name, m.material_id
     FROM material_finish as  mf
     LEFT JOIN finish AS f ON f.finish_id = mf.finish_id
     LEFT JOIN materials AS m ON m.material_id = mf.material_id`;
    try{
        const machines = await db.promise().query(retrieveQuery);
        return res.status(200).json(machines[0]);
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Something went wrong"});
    }
}
const update = async(req, res)=>{
    try {
     const {material_id, finish_id, material_finish_id} = req.body;
     const updateQuery = `UPDATE material_finish SET material_id = ?, finish_id = ? WHERE material_finish_id = ? `;
     await db.promise().query(updateQuery, [material_id, finish_id, material_finish_id]);
     return res.status(200).json({message: "Update successfully."});
    } catch (error) {
     return res.status(500).json({message: "Something went wrong"});
    }
 
 }

 const deleteMaterialFinish = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteQuery = `DELETE FROM material_finish WHERE material_finish_id = ?`;
        await db.promise().query(deleteQuery, [id]);
        return res.status(200).json({message:"Material finish deleted successfully."});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
        
    }
}
module.exports = {
    createMaterialFinish,
    getByMaterialId,
    getAll,
    update,
    deleteMaterialFinish
}