import os
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from datetime import datetime


VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "teste123")


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)

        mode = query.get("hub.mode", [None])[0]
        challenge = query.get("hub.challenge", [None])[0]
        token = query.get("hub.verify_token", [None])[0]

        if mode == "subscribe" and token == VERIFY_TOKEN:
            print("WEBHOOK VERIFIED")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(challenge.encode())
        else:
            self.send_response(403)
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"\nWebhook received {timestamp}\n")

        try:
            data = json.loads(body)
            print(json.dumps(data, indent=2))
        except Exception:
            print(body.decode())

        self.send_response(200)
        self.end_headers()
