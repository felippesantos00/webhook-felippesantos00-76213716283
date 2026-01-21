import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()  # lê .env.local

app = Flask(__name__)
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "teste123")

# GET para verificação do webhook
@app.route("/api/webhook", methods=["GET"])
def verify():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("WEBHOOK VERIFIED")
        return challenge, 200
    return "Forbidden", 403

# POST para receber eventos
@app.route("/api/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    print("Webhook received:")
    print(data)
    return "OK", 200
