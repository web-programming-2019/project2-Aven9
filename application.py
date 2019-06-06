import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on('message')
def handle_message(message):
    emit('response', message, broadcast=True)


@app.route("/load", methods=["POST", "GET"])
def load():
    user = request.form.get('user')
    content = request.form.get('content')
    timestamp = request.form.get('timestamp')
    return jsonify([{'user': user, 'content': content, 'timestamp': timestamp}])
