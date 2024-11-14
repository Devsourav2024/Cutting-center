const db = require('../../configs/db');

const getAll = async(req, res)=>{
   try {
     const retreiveQuery = `SELECT * FROM percentages`;
     const percentages = await db.promise().query(retreiveQuery);
     return res.status(200).json(percentages[0]);
   } catch (error) {
    return res.status(500).json({error:error, message:"Something went wrong!"})
   }
    
}
const update = async(req, res)=>{
    try {
     const {percentage_id, percentage} = req.body;
     const updateQuery = `UPDATE percentages SET percentage = ? WHERE percentage_id = ?`;
     await db.promise().query(updateQuery, [percentage, percentage_id]);
     return res.status(200).json({message: "Update successfully."});
    } catch (error) {
     return res.status(500).json({message: "Something went wrong"});
    }
 
 }

module.exports = {
    getAll,
    update
}