from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import get_db

gamification_bp = Blueprint("gamification", __name__)

NIVEIS = [
    {"nivel": "Iniciante",   "badge": "🌱", "cor": "#64748b", "min": 0,   "max": 29,   "recompensa": "Acesso básico à plataforma"},
    {"nivel": "Ativo",       "badge": "🔥", "cor": "#f97316", "min": 30,  "max": 99,   "recompensa": "Destaque nos materiais por 7 dias"},
    {"nivel": "Colaborador", "badge": "⭐", "cor": "#10b981", "min": 100, "max": 199,  "recompensa": "Selo de Colaborador no perfil"},
    {"nivel": "Expert",      "badge": "💎", "cor": "#6366f1", "min": 200, "max": 499,  "recompensa": "Prioridade nas solicitações"},
    {"nivel": "Lendário",    "badge": "🏆", "cor": "#f59e0b", "min": 500, "max": 9999, "recompensa": "Hall da Fama + todos os benefícios"},
]

CONQUISTAS = [
    {"id": "primeira_doacao",     "nome": "Primeira Doação",     "icone": "🎁", "descricao": "Realizou sua primeira doação",           "pontos": 15},
    {"id": "primeira_troca",      "nome": "Primeira Troca",      "icone": "🔄", "descricao": "Realizou sua primeira troca",            "pontos": 10},
    {"id": "primeiro_emprestimo", "nome": "Primeiro Empréstimo", "icone": "📚", "descricao": "Realizou seu primeiro empréstimo",       "pontos": 10},
    {"id": "cinco_trocas",        "nome": "Negociador",          "icone": "🤝", "descricao": "Realizou 5 trocas",                      "pontos": 20},
    {"id": "dez_doacoes",         "nome": "Generoso",            "icone": "💝", "descricao": "Realizou 10 doações",                    "pontos": 50},
    {"id": "cadastrou_material",  "nome": "Colaborador Inicial", "icone": "📦", "descricao": "Cadastrou seu primeiro material",        "pontos": 5},
    {"id": "cinco_materiais",     "nome": "Acervo Rico",         "icone": "📚", "descricao": "Cadastrou 5 materiais",                  "pontos": 15},
]


def get_nivel_info(pontos):
    for n in NIVEIS:
        if n["min"] <= pontos <= n["max"]:
            return n
    return NIVEIS[-1]


def calcular_progresso(pontos):
    nivel = get_nivel_info(pontos)
    if nivel["max"] == 9999:
        return {"percent": 100, "faltam": 0, "proximo": None}
    total   = nivel["max"] - nivel["min"] + 1
    atual   = pontos - nivel["min"]
    percent = int((atual / total) * 100)
    faltam  = nivel["max"] - pontos + 1
    proximo = next((n for n in NIVEIS if n["min"] == nivel["max"] + 1), None)
    return {"percent": percent, "faltam": faltam, "proximo": proximo}


def verificar_e_creditar_conquistas(cursor, user_id, doacoes, trocas, emprest, materiais_count):
    """Verifica conquistas e credita pontos caso ainda não tenham sido creditados."""

    # Busca conquistas já creditadas no log
    cursor.execute(
        "SELECT motivo FROM reputacao_log WHERE usuario_id = %s AND motivo LIKE 'conquista:%%'",
        (user_id,)
    )
    ja_creditadas = {row["motivo"] for row in cursor.fetchall()}

    pontos_adicionados = 0

    for c in CONQUISTAS:
        chave = f"conquista:{c['id']}"
        if chave in ja_creditadas:
            continue

        desbloqueada = False
        if c["id"] == "primeira_doacao"     and doacoes        >= 1:  desbloqueada = True
        if c["id"] == "primeira_troca"      and trocas         >= 1:  desbloqueada = True
        if c["id"] == "primeiro_emprestimo" and emprest        >= 1:  desbloqueada = True
        if c["id"] == "cinco_trocas"        and trocas         >= 5:  desbloqueada = True
        if c["id"] == "dez_doacoes"         and doacoes        >= 10: desbloqueada = True
        if c["id"] == "cadastrou_material"  and materiais_count >= 1: desbloqueada = True
        if c["id"] == "cinco_materiais"     and materiais_count >= 5: desbloqueada = True

        if desbloqueada:
            cursor.execute(
                "INSERT INTO reputacao_log (usuario_id, variacao, motivo) VALUES (%s, %s, %s)",
                (user_id, c["pontos"], chave)
            )
            cursor.execute(
                "UPDATE usuarios SET pontos_reputacao = pontos_reputacao + %s WHERE id = %s",
                (c["pontos"], user_id)
            )
            pontos_adicionados += c["pontos"]

    return pontos_adicionados


@gamification_bp.route("/gamification/me", methods=["GET"])
@jwt_required()
def get_my_gamification():
    user_id = int(get_jwt_identity())

    conn   = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT nome, pontos_reputacao AS pontos FROM usuarios WHERE id = %s",
        (user_id,)
    )
    user = cursor.fetchone()

    cursor.execute("""
        SELECT
            SUM(tipo = 'Doação')     AS doacoes,
            SUM(tipo = 'Troca')      AS trocas,
            SUM(tipo = 'Empréstimo') AS emprestimos
        FROM historico_transacoes
        WHERE usuario_dono_id = %s OR usuario_req_id = %s
    """, (user_id, user_id))
    counts = cursor.fetchone()

    cursor.execute(
        "SELECT COUNT(*) AS total FROM materiais WHERE usuario_id = %s",
        (user_id,)
    )
    materiais_count = cursor.fetchone()["total"]

    doacoes = counts["doacoes"]  or 0
    trocas  = counts["trocas"]   or 0
    emprest = counts["emprestimos"] or 0

    # Credita pontos de conquistas ainda não creditadas
    adicionados = verificar_e_creditar_conquistas(
        cursor, user_id, doacoes, trocas, emprest, materiais_count
    )
    if adicionados > 0:
        conn.commit()

    # Recarrega pontos atualizados
    cursor.execute(
        "SELECT pontos_reputacao AS pontos FROM usuarios WHERE id = %s",
        (user_id,)
    )
    pontos = cursor.fetchone()["pontos"]

    conquistas_status = []
    for c in CONQUISTAS:
        desbloqueada = False
        if c["id"] == "primeira_doacao"     and doacoes        >= 1:  desbloqueada = True
        if c["id"] == "primeira_troca"      and trocas         >= 1:  desbloqueada = True
        if c["id"] == "primeiro_emprestimo" and emprest        >= 1:  desbloqueada = True
        if c["id"] == "cinco_trocas"        and trocas         >= 5:  desbloqueada = True
        if c["id"] == "dez_doacoes"         and doacoes        >= 10: desbloqueada = True
        if c["id"] == "cadastrou_material"  and materiais_count >= 1: desbloqueada = True
        if c["id"] == "cinco_materiais"     and materiais_count >= 5: desbloqueada = True
        conquistas_status.append({**c, "desbloqueada": desbloqueada})

    nivel     = get_nivel_info(pontos)
    progresso = calcular_progresso(pontos)

    cursor.close()
    conn.close()

    return jsonify({
        "nome":      user["nome"],
        "pontos":    pontos,
        "nivel":     nivel,
        "progresso": progresso,
        "conquistas": conquistas_status,
        "estatisticas": {
            "doacoes":     int(doacoes),
            "trocas":      int(trocas),
            "emprestimos": int(emprest),
            "materiais":   materiais_count,
        },
        "recompensas": [
            {
                "nivel": n["nivel"], "badge": n["badge"], "cor": n["cor"],
                "recompensa": n["recompensa"],
                "desbloqueada": pontos >= n["min"]
            }
            for n in NIVEIS
        ]
    })


@gamification_bp.route("/gamification/add-points", methods=["POST"])
@jwt_required()
def add_points():
    from flask import request as req
    user_id  = int(get_jwt_identity())
    data     = req.json
    variacao = data.get("variacao", 0)
    motivo   = data.get("motivo", "Ação realizada")

    conn   = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO reputacao_log (usuario_id, variacao, motivo) VALUES (%s, %s, %s)",
        (user_id, variacao, motivo)
    )
    cursor.execute(
        "UPDATE usuarios SET pontos_reputacao = pontos_reputacao + %s WHERE id = %s",
        (variacao, user_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Pontos adicionados", "variacao": variacao})