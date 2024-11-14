const db = require('../../configs/db');


const addFaq = async(req, res)=>{
    try {
        const {faq_question, faq_answer}= req.body;
        const insertQuery = `INSERT INTO faqs (faq_question, faq_answer) VALUES(?,?)`;
        await db.promise().query(insertQuery, [faq_question, faq_answer]);
        return res.status(201).json({message: "FAQ added successfully!"});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong", error: error})
    }
}

const getAll = async(req, res)=>{
    const retrieveQuery =  `SELECT * FROM faqs`;
    try{
        const faqs = await db.promise().query(retrieveQuery);
        return res.status(200).json(faqs[0]);
    }catch(error){
        return res.status(500).json({message: "Something went wrong"});
    }
}

const update = async(req, res)=>{
    try {
     const {faq_question, faq_answer, faq_id} = req.body;
     const updateQuery = `UPDATE faqs SET faq_question = ?, faq_answer = ? WHERE faq_id = ?`;
     await db.promise().query(updateQuery, [faq_question, faq_answer, faq_id]);
     return res.status(200).json({message: "Update successfully."});
    } catch (error) {
     return res.status(500).json({message: "Something went wrong"});
    }
 
 }

 const deleteFaq = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteQuery = `DELETE FROM faqs WHERE faq_id = ?`;
        await db.promise().query(deleteQuery, [id]);
        return res.status(200).json({message:"FAQ deleted successfully."});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
        
    }
}


module.exports = {
    getAll,
    addFaq,
    update,
    deleteFaq
}