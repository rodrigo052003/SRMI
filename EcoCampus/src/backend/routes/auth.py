from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    create_access_token
)

from data.users import users

from services.security import (
    hash_password,
    verify_password
)

auth_bp = Blueprint(
    "auth",
    __name__
)

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.json

    email = data["email"]

    password = data["password"]

    for user in users:

        if user["email"] == email:

            if verify_password(
                password,
                user["password"]
            ):

                token = create_access_token(
                    identity=str(user["id"])
                )

                return jsonify({

                    "token": token,

                    "name":
                    user["name"]

                })

    return jsonify({

        "message":
        "Credenciais inválidas"

    }), 401

@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():

    data = request.json

    email = data["email"]

    for user in users:

        if user["email"] == email:

            return jsonify({
                "message":
                "Email já cadastrado"
            }), 400

    new_user = {

        "id": len(users) + 1,

        "name": data["name"],

        "email": email,

        "password": hash_password(
            data["password"]
        ),

        "role": "student",

        "reputation": 0
    }

    users.append(new_user)

    print(users)

    return jsonify({
        "message":
        "Usuário criado"
    }), 201