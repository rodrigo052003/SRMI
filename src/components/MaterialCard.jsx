import "./MaterialCard.css";

export default function MaterialCard({
  material
}) {
  return (
    <div className="material-card">

      <div>

        <h3>{material.title}</h3>

        <p>
          Qualidade: {material.quality}
        </p>

        <span>
          {material.status}
        </span>

      </div>

      <div className="actions">

        <button>
          Editar
        </button>

        <button className="danger">
          Remover
        </button>

      </div>

    </div>
  );
}