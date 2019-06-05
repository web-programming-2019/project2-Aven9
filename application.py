import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room, send

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")


# @socketio.on('join')
# def on_join(data):
#     username = data.username
#     room = data['room']
#     join_room(room)


@socketio.on('message')
def handle_message(message):
    emit('response', message, broadcast=True)
