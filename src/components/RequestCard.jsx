import "./RequestCard.css";

export default function RequestCard({
  request
}) {
  return (
    <div className="request-card">

      <h3>{request.user}</h3>

      <p>
        Solicitou:
      </p>

      <strong>
        {request.material}
      </strong>

      <div className="request-actions">

        <button>
          Aceitar
        </button>

        <button className="danger">
          Recusar
        </button>

      </div>

    </div>
  );
}