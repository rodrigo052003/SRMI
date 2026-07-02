from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from config import get_db

requests_bp = Blueprint("requests", __name__)

PONTOS_POR_TIPO = {
    "Doação":     10,
    "Troca":       5,
    "Empréstimo":  5,
}


@requests_bp.route("/requests", methods=["GET"])
@jwt_required()
def get_requests():
    user_id = int(get_jwt_identity())

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT s.id, m.titulo AS material,
               u.nome AS owner, s.tipo AS type,
               s.status, s.mensagem AS message,
               s.criado_em AS created_at
        FROM   solicitacoes s
        JOIN   materiais    m ON m.id = s.material_id
        JOIN   usuarios     u ON u.id = m.usuario_id
        WHERE  s.solicitante_id = %s
        ORDER  BY s.criado_em DESC
        """,
        (user_id,)
    )
    solicitacoes = cursor.fetchall()
    cursor.close()
    conn.close()

    for s in solicitacoes:
        if s.get("created_at"):
            s["created_at"] = str(s["created_at"])

    return jsonify(solicitacoes)


@requests_bp.route("/requests/received", methods=["GET"])
@jwt_required()
def get_received_requests():
    user_id = int(get_jwt_identity())

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT s.id, m.titulo AS material,
               u.nome AS requester, s.tipo AS type,
               s.status, s.mensagem AS message,
               s.criado_em AS created_at
        FROM   solicitacoes s
        JOIN   materiais    m ON m.id  = s.material_id
        JOIN   usuarios     u ON u.id  = s.solicitante_id
        WHERE  m.usuario_id = %s
        ORDER  BY s.criado_em DESC
        """,
        (user_id,)
    )
    solicitacoes = cursor.fetchall()
    cursor.close()
    conn.close()

    for s in solicitacoes:
        if s.get("created_at"):
            s["created_at"] = str(s["created_at"])

    return jsonify(solicitacoes)


@requests_bp.route("/requests", methods=["POST"])
@jwt_required()
def create_request():
    user_id = int(get_jwt_identity())
    data    = request.json

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)

    # Impede o dono de solicitar o próprio material
    cursor.execute(
        "SELECT usuario_id, titulo FROM materiais WHERE id = %s",
        (data.get("material_id"),)
    )
    material = cursor.fetchone()

    if not material:
        cursor.close()
        conn.close()
        return jsonify({"message": "Material não encontrado"}), 404

    if material["usuario_id"] == user_id:
        cursor.close()
        conn.close()
        return jsonify({"message": "Você não pode solicitar o seu próprio material"}), 400

    cursor.execute(
        """
        INSERT INTO solicitacoes
            (material_id, solicitante_id, tipo, mensagem)
        VALUES (%s, %s, %s, %s)
        """,
        (
            data.get("material_id"),
            user_id,
            data.get("type", "Troca"),
            data.get("message", "")
        )
    )
    conn.commit()
    new_id = cursor.lastrowid

    # Notifica o dono do material
    cursor.execute(
        "INSERT INTO notificacoes (usuario_id, mensagem) VALUES (%s, %s)",
        (
            material["usuario_id"],
            f"Nova solicitação de {data.get('type', 'Troca')} para '{material['titulo']}'"
        )
    )
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"id": new_id, "message": "Solicitação criada", "status": "Pendente"}), 201


@requests_bp.route("/requests/<int:id>", methods=["PUT"])
@jwt_required()
def update_request(id):
    data   = request.json
    status = data.get("status")

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "UPDATE solicitacoes SET status = %s WHERE id = %s",
        (status, id)
    )
    conn.commit()

    # Quando finalizada, adiciona pontos para ambos os usuários
    if status == "Finalizada":
        cursor.execute(
            """
            SELECT s.solicitante_id, s.tipo, m.usuario_id AS dono_id
            FROM   solicitacoes s
            JOIN   materiais m ON m.id = s.material_id
            WHERE  s.id = %s
            """,
            (id,)
        )
        sol = cursor.fetchone()

        if sol:
            pontos = PONTOS_POR_TIPO.get(sol["tipo"], 5)

            # Adiciona pontos para o dono e para o solicitante
            for uid in [sol["dono_id"], sol["solicitante_id"]]:
                cursor.execute(
                    "UPDATE usuarios SET pontos_reputacao = pontos_reputacao + %s WHERE id = %s",
                    (pontos, uid)
                )
                cursor.execute(
                    "INSERT INTO reputacao_log (usuario_id, variacao, motivo) VALUES (%s, %s, %s)",
                    (uid, pontos, f"{sol['tipo']} finalizada")
                )

            conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Solicitação atualizada", "status": status})