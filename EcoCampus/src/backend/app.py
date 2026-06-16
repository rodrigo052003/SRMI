from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.materials import materials_bp
from routes.requests import requests_bp

from flask_jwt_extended import (
    JWTManager,
    create_access_token
)

app = Flask(__name__)

CORS(app)

app.config["JWT_SECRET_KEY"] = (
    "ecocampus-secret"
)

jwt = JWTManager(app)

app.register_blueprint(auth_bp)

app.register_blueprint(materials_bp)

app.register_blueprint(requests_bp)

@app.route("/")
def home():

    return {
        "message":
        "EcoCampus API"
    }

if __name__ == "__main__":

    app.run(
        debug=True
    )