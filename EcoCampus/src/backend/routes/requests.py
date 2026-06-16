from flask import Blueprint
from flask import jsonify
from flask import request
from flask_jwt_extended import jwt_required

from data.requests import requests_data

requests_bp = Blueprint(
    "requests",
    __name__
)

@requests_bp.route(
    "/requests",
    methods=["GET"]
)
def get_requests():

    return jsonify(
        requests_data
    )

@requests_bp.route(
    "/requests",
    methods=["POST"]
)
@jwt_required()
def create_request():

    data = request.json

    new_request = {

        "id":
        len(requests_data)+1,

        "material":
        data["material"],

        "status":
        "Pendente"
    }

    requests_data.append(
        new_request
    )

    return jsonify(
        new_request
    ), 201

@requests_bp.route(
    "/requests/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_request(id):

    data = request.json

    for request_item in requests_data:

        if request_item["id"] == id:

            request_item["status"] = (
                data["status"]
            )

            return jsonify(
                request_item
            )

    return jsonify({

        "message":
        "Solicitação não encontrada"

    }), 404