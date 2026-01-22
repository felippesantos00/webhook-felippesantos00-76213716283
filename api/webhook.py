import json
import os

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "teste123")


def handler(request):
    # GET → verificação
    if request.method == "GET":
        mode = request.args.get("hub.mode")
        challenge = request.args.get("hub.challenge")
        token = request.args.get("hub.verify_token")

        if mode == "subscribe" and token == VERIFY_TOKEN:
            return challenge, 200

        return "Forbidden", 403

    # POST → eventos
    if request.method == "POST":
        try:
            payload = request.get_json()
            print("Webhook recebido:")
            print(json.dumps(payload, indent=2))
        except Exception as e:
            print("Erro ao ler payload:", e)

        return "OK", 200

    return "Method Not Allowed", 405
