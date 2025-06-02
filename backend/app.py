from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes (usually fine for dev)

@app.route('/')
def home():
    return "Welcome to the Chatbot API! Use POST /chat with JSON {'message': 'your text'}"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()  # safer than request.json
    user_message = data.get('message', '') if data else ''

    # Simple echo chatbot response — replace with your AI logic
    bot_response = f"You said: {user_message}"

    return jsonify({'response': bot_response})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
