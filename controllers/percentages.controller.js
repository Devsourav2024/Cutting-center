const axios = require("axios");
const db = require("../configs/db");

const getPercentages = async (req, res) => {
  try {
    const retrieveQuery = `SELECT * FROM percentages`;
    const data = await db.promise().query(retrieveQuery);
    return res.status(200).json(data[0]);
  } catch (error) {
    return res.status(404).json({ msg: error.message, status: error.status });
  }
};
const getShippingCharge = async (req, res) => {
  try {
    const retrieveQuery = `SELECT * FROM charges WHERE charges_name = "SHIPPING_CHARGE"`;
    const data = await db.promise().query(retrieveQuery);
    return res.status(200).json(data[0][0]);
  } catch (error) {
    return res.status(404).json({ msg: error.message, status: error.status });
  }
};
const getDistrictShippingCharge = async (req, res) => {
  try {
    const { city_id, district } = req.body;
    const retrieveQuery = `SELECT * FROM district WHERE city_id = ${city_id} AND  name= '${district}'`;
    const data = await db.promise().query(retrieveQuery);
    // console.log("data==>", data);
    // let districtName = data[0][0];
    let districtName = data[0][0];
    console.log("districtName==>", districtName);
    //return false;
    let shippingcharge = 0;
    if (districtName != undefined) {
      console.log("districtName==>", districtName);
      shippingcharge = districtName.shipping_charge;
    } else {
      const retrieveQuery1 = `SELECT * FROM district WHERE city_id = ${city_id} AND  name= 'Other'`;
      const datas = await db.promise().query(retrieveQuery1);
      console.log("datas==>", datas);
      shippingcharge = datas[0][0].shipping_charge;
    }
    //  return false;

    return res.status(200).json(shippingcharge);
  } catch (error) {
    return res.status(404).json({ msg: error.message, status: error.status });
  }
};
module.exports = {
  getPercentages,
  getShippingCharge,
  getDistrictShippingCharge,
};
