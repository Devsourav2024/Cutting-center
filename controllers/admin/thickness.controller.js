const db = require('../../configs/db');

const createThickness = async(req, res)=>{
    const {thickness} = req.body;
    const insertThicknessQuery = `INSERT INTO thickness (thickness) values(?)`;
    try{
        await db.promise().query(insertThicknessQuery, [thickness]);
        res.status(201).json("data inserted");
    }catch(err){
        res.status(500).json({ error: err });
    }
}

const getAllThickness = async(req, res)=>{
    const retrieveQuery =  `SELECT * FROM thickness`;
    try{
        const machines = await db.promise().query(retrieveQuery);
        return res.status(200).json(machines[0]);
    }catch(error){
        return res.status(500).json({message: "Something went wrong"});
    }
}
const update = async(req, res)=>{
   try {
    const {thickness, thickness_id} = req.body;
    const updateQuery = `UPDATE thickness SET thickness = ? WHERE thickness_id = ?`;
    await db.promise().query(updateQuery, [thickness, thickness_id]);
    return res.status(200).json({message: "Update successfully."});
   } catch (error) {
    return res.status(500).json({message: "Something went wrong"});
   }

}
const deleteThickness = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteQuery = `DELETE FROM thickness WHERE thickness_id = ?`;
        await db.promise().query(deleteQuery, [id]);
        return res.status(200).json({message:"Machine deleted successfully."});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
        
    }
}

module.exports = {
    createThickness,
    getAllThickness,
    update,
    deleteThickness
}