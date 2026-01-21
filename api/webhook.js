const express = require("express");
const serverless = require("serverless-http"); // importante
const app = express();

app.use(express.json());

const verifyToken = process.env.VERIFY_TOKEN || "teste123";

// GET para verificação do webhook
app.get("/", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge); // <- retorna corretamente o hub.challenge
  }
  return res.status(403).send("Forbidden");
});

// POST para receber eventos
app.post("/", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`Webhook received ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send("OK"); // <- importante enviar algum texto
});

// exporta para serverless
module.exports = serverless(app);
