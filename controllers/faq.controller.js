const db = require('../configs/db');

exports.getAll = async(req, res)=>{
    try {
        const retreiveQuery = `SELECT * FROM faqs`;
        const faqs = await db.promise().query(retreiveQuery);
        return res.status(200).json(faqs[0]);
    } catch (error) {
        return res.status(500).json({message:"Something went wrong!", error: error});
    }
}