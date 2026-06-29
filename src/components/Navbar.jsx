import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

const BASE_URL = "http://127.0.0.1:5000";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nivelData, setNivelData] = useState(null);
  const timeoutRef = useRef(null);
  const profileRef = useRef(null);

  const userName = localStorage.getItem("userName") || "Usuário";
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();

  // Fecha o modal ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Carrega dados de nível ao abrir o modal
  const handleProfileClick = () => {
    const next = !profileOpen;
    setProfileOpen(next);

    if (next && !nivelData) {
      const token = localStorage.getItem("token");
      fetch(`${BASE_URL}/gamification/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(d => setNivelData(d))
        .catch(() => setNivelData("erro"));
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setMenuOpen(false), 250);
  };
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  return (
    <nav className="navbar">
      <div className="logo">EcoCampus</div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/my-materials">Meus Materiais</Link>

        <div
          className="dropdown-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="dropdown-button">Mais ▼</button>

          {menuOpen && (
            <div className="dropdown-menu">
              <Link to="/requests">Solicitações</Link>
              <Link to="/notifications">Notificações</Link>
              <Link to="/history">Histórico</Link>
              <Link to="/reputation">Reputação</Link>
              <Link to="/about">Sobre</Link>
              <Link to="/help">Ajuda</Link>
            </div>
          )}
        </div>
      </div>

      {/* Avatar de perfil */}
      <div className="user-menu" ref={profileRef}>
        <button className="avatar-btn" onClick={handleProfileClick} title={userName}>
          {initials}
        </button>

        {profileOpen && (
          <div className="profile-modal">
            <div className="profile-modal-header">
              <div className="avatar-lg">{initials}</div>
              <div>
                <strong>{userName}</strong>
                <p>Universidade Federal</p>
              </div>
            </div>

            <hr className="modal-divider" />

            {/* Seção de Nível */}
            {!nivelData && (
              <p className="modal-loading">Carregando nível...</p>
            )}
            {nivelData === "erro" && (
              <p className="modal-error">Erro ao carregar nível.</p>
            )}
            {nivelData && nivelData !== "erro" && (
              <div className="modal-nivel">
                <div className="modal-nivel-top">
                  <span className="modal-badge">{nivelData.nivel?.badge}</span>
                  <div>
                    <strong style={{ color: nivelData.nivel?.cor }}>
                      {nivelData.nivel?.nivel}
                    </strong>
                    <span className="modal-pts">{nivelData.pontos} pontos</span>
                  </div>
                </div>

                {nivelData.progresso?.proximo && (
                  <>
                    <div className="modal-progress-label">
                      <small>Próximo: {nivelData.progresso.proximo.badge} {nivelData.progresso.proximo.nivel}</small>
                      <small>{nivelData.progresso.faltam} pts</small>
                    </div>
                    <div className="modal-progress-bar">
                      <div
                        className="modal-progress-fill"
                        style={{
                          width: `${nivelData.progresso.percent}%`,
                          background: nivelData.nivel?.cor,
                        }}
                      />
                    </div>
                  </>
                )}
                {!nivelData.progresso?.proximo && (
                  <p className="modal-max">🏆 Nível máximo atingido!</p>
                )}
              </div>
            )}

            <hr className="modal-divider" />

            <div className="modal-actions">
              <Link to="/profile" onClick={() => setProfileOpen(false)}>
                Ver perfil completo
              </Link>
              <Link to="/gamification" onClick={() => setProfileOpen(false)}>
                Ver conquistas
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
