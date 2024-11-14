const db = require('../../configs/db');

const createColors = async(req, res)=>{
    const {color_name} = req.body;
    const insertColorsQuery = `INSERT INTO colors (color_name) values(?)`;
    try{
        await db.promise().query(insertColorsQuery, [color_name]);
        res.status(201).json("data inserted");
    }catch(err){
        res.status(500).json({ error: err });
    }
}
const getAll = async(req, res)=>{
    const retrieveQuery =  `SELECT * FROM colors`;
    try{
        const machines = await db.promise().query(retrieveQuery);
        return res.status(200).json(machines[0]);
    }catch(error){
        return res.status(500).json({message: "Something went wrong"});
    }
}
const update = async(req, res)=>{
   try {
    const {color_name, color_id} = req.body;
    const updateQuery = `UPDATE colors SET color_name = ? WHERE color_id = ?`;
    await db.promise().query(updateQuery, [color_name, color_id]);
    return res.status(200).json({message: "Update successfully."});
   } catch (error) {
    return res.status(500).json({message: "Something went wrong"});
   }

}
const deleteColor = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteQuery = `DELETE FROM colors WHERE color_id = ?`;
        await db.promise().query(deleteQuery, [id]);
        return res.status(200).json({message:"Machine deleted successfully."});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
        
    }
}

module.exports = {
    createColors,
    getAll,
    update,
    deleteColor
}