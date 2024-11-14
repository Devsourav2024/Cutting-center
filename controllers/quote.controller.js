const db = require("../configs/db");

const calculateQuote = async (obj) => {
  const {
    height,
    width,
    circumference,
    material_id,
    machine_id,
    thickness_id,
    quantity,
    isUserProvideMaterial,
    linearMeters,
  } = obj;

  const getMaterialPriceAndCuttingPriceQuery = `SELECT price, cutting_price
    FROM material_thickness
    WHERE material_id =? AND thickness_id =? ;`;
  const getMaterialPriceAndCuttingPrice = await db
    .promise()
    .query(getMaterialPriceAndCuttingPriceQuery, [
      material_id,
      thickness_id,
      machine_id,
    ]);
  const h = height / 1000;
  const w = width / 1000;
  const lm = circumference / 1000;

  const totalSqrMtrs = Number((h * w).toFixed(2));
  const totalCuttingSqrMtrs = Number((totalSqrMtrs * quantity).toFixed(2));
  if (!isUserProvideMaterial) {
    const sheetCostPerSqrMtr = Number(
      getMaterialPriceAndCuttingPrice[0][0].price
    );
    const sheetCuttingCostPerSqrMtr = Number(
      getMaterialPriceAndCuttingPrice[0][0].cutting_price
    );
    let totalSheetCost =
      Math.floor(totalCuttingSqrMtrs * sheetCostPerSqrMtr * 100) / 100;
    //totalSheetCost = Math.floor(totalSheetCost * 100) / 100;
    const totalSheetCuttingCost = lm * quantity * sheetCuttingCostPerSqrMtr;

    // get percentages
    const retreiveQuery = `SELECT * FROM percentages`;
    const percentages = await db.promise().query(retreiveQuery);
    let safetyPercentage;
    let vatPercentage;
    let profitPercentage;
    percentages[0].map((item) => {
      item.percentage_name === "Safety"
        ? (safetyPercentage = item.percentage / 100)
        : item.percentage_name === "VAT"
        ? (vatPercentage = item.percentage / 100)
        : item.percentage_name === "Profit"
        ? (profitPercentage = item.percentage / 100)
        : null;
    });

    const marginOfSafety = Number(
      (totalSheetCost * safetyPercentage).toFixed(2)
    );

    const totalCost = totalSheetCost + totalSheetCuttingCost + marginOfSafety;

    const profit = Math.floor(totalCost * profitPercentage * 100) / 100;

    const taxableValue = totalCost + profit;

    const vat = Math.round(taxableValue * vatPercentage * 100) / 100;

    const sellingPrice = Math.round((taxableValue + vat) * 100) / 100;
    return {
      sellingPrice: sellingPrice,
      totalCuttingSqrMtrs: totalCuttingSqrMtrs,
      vat,
      vatPercentage,
      profit,
      marginOfSafety,
      totalCost,
      taxableValue,
      linearMeters,
    };
  } else {
    const sheetCostPerSqrMtr = Number(
      getMaterialPriceAndCuttingPrice[0][0].price
    );
    const sheetCuttingCostPerSqrMtr = Number(
      getMaterialPriceAndCuttingPrice[0][0].cutting_price
    );
    let totalSheetCost = Math.floor(1 * 1 * 100) / 100;
    //totalSheetCost = Math.floor(totalSheetCost * 100) / 100;
    const totalSheetCuttingCost = lm * quantity * sheetCuttingCostPerSqrMtr;

    // get percentages
    const retreiveQuery = `SELECT * FROM percentages`;
    const percentages = await db.promise().query(retreiveQuery);
    let safetyPercentage;
    let vatPercentage;
    let profitPercentage;
    percentages[0].map((item) => {
      item.percentage_name === "Safety"
        ? (safetyPercentage = item.percentage / 100)
        : item.percentage_name === "VAT"
        ? (vatPercentage = item.percentage / 100)
        : item.percentage_name === "Profit"
        ? (profitPercentage = item.percentage / 100)
        : null;
    });

    const marginOfSafety = Number((1 * safetyPercentage).toFixed(2));

    const totalCost = 0 + totalSheetCuttingCost + marginOfSafety;

    const profit = Math.floor(totalCost * profitPercentage * 100) / 100;

    const taxableValue = totalCost + profit;

    const vat = Math.round(taxableValue * vatPercentage * 100) / 100;

    const sellingPrice = Math.round((taxableValue + vat) * 100) / 100;
    console.log("Check: ", vat, profit, marginOfSafety);
    return {
      sellingPrice: sellingPrice,
      totalCuttingSqrMtrs: totalCuttingSqrMtrs,
      vat,
      vatPercentage,
      profit,
      marginOfSafety,
      totalCost,
      taxableValue,
      linearMeters,
    };
  }
};

const getQuote = async (req, res, next) => {
  try {
    const response = await calculateQuote(req.body);
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.log("Error calculating: ", JSON.stringify(err));
    res.status(500).json({ message: err });
  }
};
module.exports = {
  getQuote,
};
