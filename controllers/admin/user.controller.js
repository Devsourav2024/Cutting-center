const db = require("../../configs/db");

const getAll = async (req, res) => {
  try {
    const retreiveQuery = `SELECT * FROM users`;
    const users = await db.promise().query(retreiveQuery);

    res.status(200).json(users[0]);
  } catch (error) {
    res.status(500).json({message:error});
  }
};
const getUserCount = async(req, res)=>{
    try{
      const retrieveQuery = `SELECT COUNT(*) AS user_count FROM users`;
      const count = await db.promise().query(retrieveQuery);
      console.log(count[0]);
      return res.status(200).json(count[0][0]);
    }catch(error){
        return res.status(500).json({message:"Something went wrong!", error: error});
    }
  }

const update = async(req, res)=>{
    try {
        const {user_id, address, first_name, last_name, email, contact_number} = req.body;
        const updateQuery = `UPDATE users SET first_name = ?, last_name = ?, email = ?, contact_number = ?, address = ? WHERE user_id = ? `;
        await db.promise().query(updateQuery, [first_name, last_name, email, contact_number,address, user_id]);
        return res.status(200).json({message: "Update successfully."});
       } catch (error) {
        return res.status(500).json({message: "Something went wrong"});
       }
}

const deleteUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteQuery = `DELETE FROM users WHERE user_id = ?`;
        await db.promise().query(deleteQuery, [id]);
        return res.status(200).json({message:"User deleted successfully."});
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"});
        
    }
}

module.exports = {
  getAll,
  update,
  deleteUser,
  getUserCount
};
