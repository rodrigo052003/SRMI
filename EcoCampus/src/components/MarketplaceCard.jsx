import "./MarketplaceCard.css";
import { Link } from "react-router-dom";

export default function MarketplaceCard({
  material
}) {

  return (
    <div className="market-card">

      <div className="material-image">
        📚
      </div>

      <h3>{material.title}</h3>

      <p>
        Qualidade: {material.quality}
      </p>

      <span>
        {material.transaction}
      </span>

      <Link to={`/material/${material.id}`}>
         <button>
              Ver Detalhes
         </button>
      </Link>

    </div>
  );
}