const express = require("express");
const serverless = require("serverless-http");
const app = express();

app.use(express.json());

const verifyToken = process.env.VERIFY_TOKEN || "teste123";

app.get("/", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;
  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }
  return res.status(403).end();
});

app.post("/", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`Webhook received ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// **Não use app.listen()**
module.exports = serverless(app);
