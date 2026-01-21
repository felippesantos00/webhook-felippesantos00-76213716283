const express = require("express");
const serverless = require("serverless-http"); // <--- IMPORTAR serverless-http

const app = express();
app.use(express.json());

const verifyToken = process.env.VERIFY_TOKEN;

// GET para verificação do webhook
app.get("/", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// POST para receber eventos
app.post("/", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// EXPORTA a função serverless para Vercel
module.exports = serverless(app);
