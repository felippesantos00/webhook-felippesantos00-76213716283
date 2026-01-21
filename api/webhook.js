const express = require("express");
const serverless = require("serverless-http"); // permite rodar no Vercel
const app = express();

app.use(express.json());

const verifyToken = process.env.VERIFY_TOKEN ;

// GET para verificação do webhook
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

// POST para receber eventos
app.post("/", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`Webhook received ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// **Não usar app.listen() no Vercel**
module.exports = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Exporta o app para o Vercel
module.exports.handler = serverless(app);
