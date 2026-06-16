from flask import Blueprint
from flask import jsonify
from flask import request
from flask_jwt_extended import jwt_required

from data.materials import materials

materials_bp = Blueprint(
    "materials",
    __name__
)

@materials_bp.route(
    "/materials",
    methods=["GET"]
)
def get_materials():

    return jsonify(materials)

@materials_bp.route(
    "/materials",
    methods=["POST"]
)
def create_material():

    data = request.json

    material = {

        "id":
        len(materials) + 1,

        "title":
        data["title"],

        "category": data["category"],

        "quality":
        data["quality"],

        "transaction":
        data["transaction"]

    }

    materials.append(
        material
    )

    return jsonify(
        material
    ), 201

@materials_bp.route(
    "/materials/<int:id>",
    methods=["PUT"]
)
def update_material(id):

    data = request.json

    for i in range(len(materials)):

        if materials[i]["id"] == id:

            materials[i]["title"] = data["title"]
            materials[i]["category"] = data["category"]
            materials[i]["quality"] = data["quality"]
            materials[i]["transaction"] = data["transaction"]

            return jsonify(materials[i]), 200

    return jsonify({
        "message": "Material não encontrado"
    }), 404

@materials_bp.route(
    "/materials/<int:id>",
    methods=["DELETE"]
)
def delete_material(id):

    for material in materials:

        if material["id"] == id:

            materials.remove(
                material
            )

            return jsonify({

                "message":
                "Removido"

            })

    return jsonify({

        "message":
        "Material não encontrado"

    }), 404

@materials_bp.route(
    "/protected",
    methods=["GET"]
)
@jwt_required()
def protected():

    return jsonify({
        "message":
        "Token válido"
    })
