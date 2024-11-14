const axios = require("axios");
const sdk = require("api")("@ngenius/v3.0#1mld74kq6wekpz");

const db = require("../configs/db");

const accessToken = async (req, res) => {
  try {
    const response = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/vnd.ni-identity.v1+json",
        Authorization:
          "Basic YjA2NzQ2YWYtNjQ0Yy00YTc2LTlmZTYtMTM5YzlmYTg4NTI2OjQ5YmU5ODUzLWNjZjUtNDNiMS05YjZkLTQyZmQ4YTY0ZmNiYg==",
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
    });
    // Check if the response is as expected
    /* if (response && response.data && response.data.access_token) {
      console.log(response.data.access_token);
      res.status(200).send(response.data.access_token);
    } else {
      res.status(500).send({ message: "Invalid response from server" });
    } */
    console.log(response.data.access_token);
    res.status(200).send(response.data.access_token);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

/* const accessToken = async (req, res) => {
  try {
    const response = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/vnd.ni-identity.v1+json",
        Authorization:
          "Basic ZmEyOWVmY2UtYmM0ZS00NWFlLTkyMmMtMGE4ZDAyODM0MmYzOjgyM2QxZmQ5LTkzNjctNDk0Mi1hNGM4LWI1NjE3ZTEwMWZjOQ==",
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
    });
    console.log(response.data.access_token);
    res.status(200).send(response.data.access_token);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}; */

/* const accessToken = async (req, res) => {
  try {
    const response = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/vnd.ni-identity.v1+json",
        Authorization:
          "Basic ZWE5NDc2OGMtZmViZi00MmE1LTlhYjMtOTU2NDhlYmY3YTRjOjI3ZTE5ZTQyLTlmMDQtNDJhMS05ZTIyLWJkMTFkZDliZDdlNw==",
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
    });
    // console.log(response.data.access_token);
    res.status(200).send(response.data.access_token);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}; */

/* const createOrder = async (req, res) => {
  try {
    const { access_token, price } = req.body;

    // sdk.auth(
    //   "YjA2NzQ2YWYtNjQ0Yy00YTc2LTlmZTYtMTM5YzlmYTg4NTI2OjQ5YmU5ODUzLWNjZjUtNDNiMS05YjZkLTQyZmQ4YTY0ZmNiYg=="
    // );
    // const { data } = await sdk.createOrder('{"action":"PURCHASE"}', {
    //   outletId: "00ca36df-ca62-4274-a000-8dc48dfb0db4",
    // });
    // console.log(data);
    // res.status(200).send(data._links.payment.href);
    const { data } = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/vnd.ni-identity.v1+json",
        Authorization:
          "Basic YjA2NzQ2YWYtNjQ0Yy00YTc2LTlmZTYtMTM5YzlmYTg4NTI2OjQ5YmU5ODUzLWNjZjUtNDNiMS05YjZkLTQyZmQ4YTY0ZmNiYg==",
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
    });
    // console.log("Value:--> ", price);
    const response = await axios({
      method: "POST",
      headers: {
        Accept: "application/vnd.ni-payment.v2+json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/vnd.ni-payment.v2+json",
        Authorization: `Bearer ${data.access_token}`,
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/00ca36df-ca62-4274-a000-8dc48dfb0db4/orders",
      data: {
        action: "PURCHASE",
        amount: {
          currencyCode: "AED",
          value: Math.round(price * 100),
        },
        merchantAttributes: {
          redirectUrl: "https://thecuttingcenter.com/ThankYou",
        },
      },
    });
    res.status(200).send(response.data._links.payment.href);
  } catch (err) {
    console.log("Error: ---> ", err);
    res.status(500).send({ message: err });
  }
}; */
/* const createOrder = async (req, res) => {
  try {
    const { access_token, price } = req.body;

    const { data } = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/vnd.ni-identity.v1+json",
        Authorization:
          "Basic YjA2NzQ2YWYtNjQ0Yy00YTc2LTlmZTYtMTM5YzlmYTg4NTI2OjQ5YmU5ODUzLWNjZjUtNDNiMS05YjZkLTQyZmQ4YTY0ZmNiYg==",
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
    });
    // console.log("Value:--> ", price);
    const response = await axios({
      method: "POST",
      headers: {
        Accept: "application/vnd.ni-payment.v2+json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/vnd.ni-payment.v2+json",
        Authorization: `Bearer ${data.access_token}`,
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/00ca36df-ca62-4274-a000-8dc48dfb0db4/orders",
      data: {
        action: "PURCHASE",
        amount: {
          currencyCode: "AED",
          value: Math.round(price * 100),
        },
        merchantAttributes: {
          redirectUrl: "https://thecuttingcenter.com/my-order",
        },
      },
    });
    res.status(200).send(response.data._links.payment.href);
  } catch (err) {
    console.log("Error: ---> ", err);
    res.status(500).send({ message: err });
  }
}; */

const createOrder = async (req, res) => {
  try {
    const { access_token, price } = req.body;

    const { data } = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/vnd.ni-identity.v1+json",
        Authorization:
          "Basic ZWE5NDc2OGMtZmViZi00MmE1LTlhYjMtOTU2NDhlYmY3YTRjOjI3ZTE5ZTQyLTlmMDQtNDJhMS05ZTIyLWJkMTFkZDliZDdlNw==",
      },
      url: "https://api-gateway.ngenius-payments.com/identity/auth/access-token", // Changed to live URL
    });
    console.log("payment access====>", data);

    const response = await axios({
      method: "POST",
      headers: {
        Accept: "application/vnd.ni-payment.v2+json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/vnd.ni-payment.v2+json",
        Authorization: `Bearer ${data.access_token}`,
      },
      url: "https://api-gateway.ngenius-payments.com/transactions/outlets/ddbc3da9-e13a-442c-b4f1-1f35d478f0b4/orders", // Changed to live URL
      data: {
        action: "PURCHASE",
        amount: {
          currencyCode: "AED",
          value: Math.round(price * 100),
        },
        merchantAttributes: {
          redirectUrl: "https://thecuttingcenter.com/my-order",
        },
      },
    });

    res.status(200).send(response.data._links.payment.href);
  } catch (error) {
    console.log("Error: ---> ", error);
    console.error("Error response:", error.response?.data || error.message);

    res.status(500).send({ message: error });
  }
};

exports.getPaymentAccessToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "SECRETKEY");
  const { order_id } = req.body;
  const getToken = `SELECT access_token FROM orders where order_id = ? AND customer_id = ?`;
  db.query(getToken, [order_id, decoded.customer_id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
};
const addPayments = async (req, res) => {
  try {
    let { amount, paymentStatus, reference_id } = req.body;
    console.log(amount, paymentStatus, reference_id);
    const { userId } = req;
    paymentStatus = paymentStatus === "SUCCESS" ? "completed" : "pending";
    const addPaymentQuery = `INSERT INTO payments (amount, payment_status, order_reference) VALUES(?,?,?)`;
    const addPayment = await db
      .promise()
      .query(addPaymentQuery, [amount, paymentStatus, reference_id]);
    return res.status(201).json({ payment_id: addPayment[0].insertId });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const paymentStatusCheck = async (req, res) => {
  try {
    const { ref } = req.params;
    const tokenResponse = await axios({
      method: "post",
      headers: {
        "Content-Type": "application/vnd.ni-identity.v1+json",
        Authorization:
          "Basic YjA2NzQ2YWYtNjQ0Yy00YTc2LTlmZTYtMTM5YzlmYTg4NTI2OjQ5YmU5ODUzLWNjZjUtNDNiMS05YjZkLTQyZmQ4YTY0ZmNiYg==",
      },
      url: "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
    });
    const response = await axios.get(
      `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/00ca36df-ca62-4274-a000-8dc48dfb0db4/orders/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      }
    );
    // const apiKey =
    //   "YjA2NzQ2YWYtNjQ0Yy00YTc2LTlmZTYtMTM5YzlmYTg4NTI2OjQ5YmU5ODUzLWNjZjUtNDNiMS05YjZkLTQyZmQ4YTY0ZmNiYg==";

    // const headers = {
    //   Authorization: `${apiKey}`,
    //   "Content-Type": "application/json",
    // };
    // const refundData = {
    //   amount: 500, // Amount in cents (5 USD)
    //   reason: "Refund reason",
    // };
    // const merchantId = "00ca36df-ca62-4274-a000-8dc48dfb0db4";
    // const refundEndpoint = `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/${merchantId}/orders/${ref}/refund`;
    // //console.log("Capture payment Status: ---> ", response);
    // const capture = await axios.post(refundEndpoint, refundData, { headers });
    // const paymentReference = response.data._embedded.payment[0].reference;
    // console.log("Capture: ", capture);
    // const capture = await axios.post(
    //   `https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/00ca36df-ca62-4274-a000-8dc48dfb0db4/orders/${response.data.reference}/payments/${paymentReference}/captures`,
    //   {
    //     headers: {
    //       Accept: "application/vnd.ni-payment.v2+json",
    //       "Content-Type": "application/vnd.ni-payment.v2+json",
    //       Authorization: `Bearer ${tokenResponse.data.access_token}`,
    //     },
    //   }
    // );
    // console.log("Capture data: ----> ", capture);
    console.log("Response data: ----> ", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.log("Capture data error : ----> ", error);
    return res.status(500).send(error);
  }
};
module.exports = {
  accessToken,
  createOrder,
  addPayments,
  paymentStatusCheck,
};
