from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from config import get_db
from services.security import hash_password, verify_password

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, nome AS name, email, tipo AS role,
               universidade, curso, pontos_reputacao
        FROM usuarios
        WHERE id = %s
        """,
        (user_id,),
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"message": "Usuário não encontrado"}), 404

    return jsonify(user)


@profile_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    data = request.json or {}

    nome = data.get("name")
    universidade = data.get("universidade")
    curso = data.get("curso")
    nova_senha = data.get("new_password")
    senha_atual = data.get("current_password")

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # Se quiser trocar a senha, valida a senha atual antes
    if nova_senha:
        cursor.execute("SELECT senha_hash FROM usuarios WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        if not row or not verify_password(senha_atual or "", row["senha_hash"]):
            cursor.close()
            conn.close()
            return jsonify({"message": "Senha atual incorreta"}), 401

    fields = []
    values = []

    if nome:
        fields.append("nome = %s")
        values.append(nome)
    if universidade is not None:
        fields.append("universidade = %s")
        values.append(universidade)
    if curso is not None:
        fields.append("curso = %s")
        values.append(curso)
    if nova_senha:
        fields.append("senha_hash = %s")
        values.append(hash_password(nova_senha))

    if fields:
        values.append(user_id)
        cursor.execute(
            f"UPDATE usuarios SET {', '.join(fields)} WHERE id = %s",
            tuple(values),
        )
        conn.commit()

    cursor.execute(
        """
        SELECT id, nome AS name, email, tipo AS role,
               universidade, curso, pontos_reputacao
        FROM usuarios
        WHERE id = %s
        """,
        (user_id,),
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(user)
