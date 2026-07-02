import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createRequest } from "../services/api";
import "./MaterialDetails.css";

export default function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/materials/${id}`)
      .then(res => res.json())
      .then(data => setMaterial(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRequest(type) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para solicitar.");
      navigate("/");
      return;
    }
    try {
      const { ok, data } = await createRequest(
        parseInt(id),
        type,
        `Solicitação de ${type}`
      );
      if (ok) {
        alert(`Solicitação de ${type} enviada!`);
        navigate("/requests");
      } else {
        alert(data.message || "Erro ao enviar solicitação.");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    }
  }

  if (loading) return <><Navbar /><p style={{ padding: "2rem" }}>Carregando...</p></>;
  if (!material) return <><Navbar /><p style={{ padding: "2rem" }}>Material não encontrado.</p></>;

  const isOwner = material.owner_id === userId;

  return (
    <>
      <Navbar />
      <div className="details-page">
        <div className="details-card">

          <div className="details-image">📚</div>

          <div className="details-info">
            <h1>{material.title}</h1>
            <p>{material.description}</p>

            <div className="details-badges">
              <span className="badge">Qualidade: {material.quality}</span>
              <span className="badge">Tipo: {material.transaction}</span>
              <span className="badge status">{material.status}</span>
            </div>

            <p className="details-owner">
              Proprietário: <strong>{material.owner}</strong>
            </p>

            {isOwner && (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                Este é o seu material.
              </p>
            )}

            {!isOwner && material.status === "Disponível" && (
              <div className="details-actions">
                <button onClick={() => handleRequest(material.transaction)}>
                  Solicitar {material.transaction}
                </button>
              </div>
            )}

            {!isOwner && material.status !== "Disponível" && (
              <p className="unavailable">
                Este material não está disponível no momento.
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}