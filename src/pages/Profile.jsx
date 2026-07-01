import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyMaterials, getProfile, updateProfile } from "../services/api";
import "./Profile.css";

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(searchParams.get("edit") === "1");

  const [name, setName] = useState("");
  const [universidade, setUniversidade] = useState("");
  const [curso, setCurso] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function loadProfile() {
    getProfile().then(data => {
      if (data && !data.message) {
        setProfile(data);
        setName(data.name || "");
        setUniversidade(data.universidade || "");
        setCurso(data.curso || "");
        localStorage.setItem("userName", data.name);
      }
    });
  }

  useEffect(() => {
    getMyMaterials().then(data => setMaterials(Array.isArray(data) ? data : []));
    loadProfile();
  }, []);

  function startEditing() {
    setEditing(true);
    setSearchParams({ edit: "1" });
  }

  function cancelEditing() {
    setEditing(false);
    setSearchParams({});
    setCurrentPassword("");
    setNewPassword("");
    setFeedback(null);
    if (profile) {
      setName(profile.name || "");
      setUniversidade(profile.universidade || "");
      setCurso(profile.curso || "");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = { name, universidade, curso };
    if (newPassword) {
      payload.new_password = newPassword;
      payload.current_password = currentPassword;
    }

    try {
      const { ok, data } = await updateProfile(payload);
      if (ok) {
        setProfile(data);
        localStorage.setItem("userName", data.name);
        setFeedback({ type: "success", text: "Perfil atualizado com sucesso!" });
        setCurrentPassword("");
        setNewPassword("");
        setEditing(false);
        setSearchParams({});
      } else {
        setFeedback({ type: "error", text: data.message || "Erro ao atualizar perfil." });
      }
    } catch {
      setFeedback({ type: "error", text: "Erro ao conectar com o servidor." });
    } finally {
      setSaving(false);
    }
  }

  const userName = profile?.name || localStorage.getItem("userName") || "Usuário";
  const reputation = profile?.pontos_reputacao ?? 0;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          {!editing ? (
            <>
              <div className="profile-card-header">
                <div>
                  <h1>{userName}</h1>
                  <p>{profile?.universidade || "Universidade Federal"}</p>
                  {profile?.curso && <p className="profile-curso">{profile.curso}</p>}
                </div>
                <button className="edit-profile-btn" onClick={startEditing}>
                  Editar informações
                </button>
              </div>

              <hr />

              <h3>Estatísticas</h3>
              <p>Materiais cadastrados: {materials.length}</p>
              <p>Pontos de reputação: {reputation}</p>

              {feedback && (
                <p className={`profile-feedback ${feedback.type}`}>{feedback.text}</p>
              )}
            </>
          ) : (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <h2>Editar informações do perfil</h2>

              <label>
                Nome
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                Universidade
                <input
                  type="text"
                  value={universidade}
                  onChange={e => setUniversidade(e.target.value)}
                  placeholder="Universidade Federal"
                />
              </label>

              <label>
                Curso
                <input
                  type="text"
                  value={curso}
                  onChange={e => setCurso(e.target.value)}
                  placeholder="Ex: Engenharia Ambiental"
                />
              </label>

              <hr />
              <p className="form-section-label">Alterar senha (opcional)</p>

              <label>
                Senha atual
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Necessária apenas se for trocar a senha"
                />
              </label>

              <label>
                Nova senha
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Deixe em branco para não alterar"
                />
              </label>

              {feedback && (
                <p className={`profile-feedback ${feedback.type}`}>{feedback.text}</p>
              )}

              <div className="profile-edit-actions">
                <button type="button" className="cancel-btn" onClick={cancelEditing}>
                  Cancelar
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
