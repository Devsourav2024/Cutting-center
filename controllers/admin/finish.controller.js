const db = require('../../configs/db');

const createFinish = async(req, res)=>{
    const {finish_name} = req.body;
    const insertFinishQuery = `INSERT INTO finish (finish_name) values(?)`;
    try{
        await db.promise().query(insertFinishQuery, [finish_name]);
        res.status(201).json("data inserted");
    }catch(err){
        res.status(500).json({ error: err });
    }
}
const getAll = async(req, res)=>{
    const retrieveQuery =  `SELECT * FROM finish`;
    try{
        const machines = await db.promise().query(retrieveQuery);
        return res.status(200).json(machines[0]);
    }catch(error){
        return res.status(500).json({message: "Something went wrong"});
    }
}
const update = async(req, res)=>{
   try {
    const {finish_name, finish_id} = req.body;
    const updateQuery = `UPDATE finish SET finish_name = ? WHERE finish_id = ?`;
    await db.promise().query(updateQuery, [finish_name, finish_id]);
    return res.status(200).json({message: "Update successfully."});
   } catch (error) {
    return res.status(500).json({message: "Something went wrong"});
   }

}
const deleteFinish = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteQuery = `DELETE FROM finish WHERE finish_id = ?`;
        await db.promise().query(deleteQuery, [id]);
        return res.status(200).json({message:"Machine deleted successfully."});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
        
    }
}

module.exports = {
    createFinish,
    getAll,
    update,
    deleteFinish
}