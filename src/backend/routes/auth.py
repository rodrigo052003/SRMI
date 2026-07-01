from datetime import timedelta

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    decode_token,
)
from jwt.exceptions import PyJWTError

from config import get_db
from services.security import hash_password, verify_password

auth_bp = Blueprint("auth", __name__)

# Token de redefinição de senha tem propósito próprio para não poder
# ser usado para logar como o usuário.
RESET_TOKEN_TYPE = "password_reset"


@auth_bp.route("/login", methods=["POST"])
def login():

    data     = request.json
    email    = data.get("email")
    password = data.get("password")

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM usuarios WHERE email = %s AND ativo = 1",
        (email,)
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user or not verify_password(password, user["senha_hash"]):
        return jsonify({"message": "Credenciais inválidas"}), 401

    token = create_access_token(identity=str(user["id"]))

    return jsonify({
        "token": token,
        "name":  user["nome"],
        "id":    user["id"]
    })


@auth_bp.route("/register", methods=["POST"])
def register():

    data  = request.json
    nome  = data.get("name")
    email = data.get("email")
    senha = data.get("password")
    tipo  = data.get("role", "Aluno")   # "Aluno" ou "Professor"

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)

    # Verifica se e-mail já existe
    cursor.execute(
        "SELECT id FROM usuarios WHERE email = %s",
        (email,)
    )
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "Email já cadastrado"}), 400

    cursor.execute(
        """
        INSERT INTO usuarios (nome, email, senha_hash, tipo)
        VALUES (%s, %s, %s, %s)
        """,
        (nome, email, hash_password(senha), tipo)
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Usuário criado"}), 201


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    """
    Gera um token de redefinição de senha para o e-mail informado.

    Como este projeto não possui um serviço de envio de e-mails
    configurado, o token é devolvido diretamente na resposta para que o
    frontend possa seguir o fluxo de redefinição (em produção, o ideal
    seria enviar esse token por e-mail e nunca retorná-lo na API).
    """

    data = request.json or {}
    email = data.get("email")

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, nome FROM usuarios WHERE email = %s AND ativo = 1",
        (email,),
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    # Sempre responde com sucesso, mesmo que o e-mail não exista,
    # para não revelar quais e-mails estão cadastrados.
    if not user:
        return jsonify(
            {"message": "Se o e-mail existir, um código de redefinição foi gerado."}
        )

    reset_token = create_access_token(
        identity=str(user["id"]),
        expires_delta=timedelta(minutes=30),
        additional_claims={"type": RESET_TOKEN_TYPE},
    )

    return jsonify(
        {
            "message": "Código de redefinição gerado.",
            "reset_token": reset_token,
        }
    )


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json or {}
    reset_token = data.get("reset_token")
    nova_senha = data.get("password")

    if not reset_token or not nova_senha:
        return jsonify({"message": "Dados incompletos"}), 400

    try:
        decoded = decode_token(reset_token)
    except PyJWTError:
        return jsonify({"message": "Token inválido ou expirado"}), 401
    except Exception:
        return jsonify({"message": "Token inválido ou expirado"}), 401

    if decoded.get("type") != RESET_TOKEN_TYPE:
        return jsonify({"message": "Token inválido"}), 401

    user_id = decoded.get("sub")

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "UPDATE usuarios SET senha_hash = %s WHERE id = %s",
        (hash_password(nova_senha), user_id),
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Senha redefinida com sucesso"})
