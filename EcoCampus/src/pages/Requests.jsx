import Navbar from "../components/Navbar";
import "./Requests.css";

export default function Requests() {

  const requests = [
    {
      id: 1,
      material: "Livro de Física",
      owner: "Maria",
      status: "Pendente"
    },
    {
      id: 2,
      material: "Calculadora Casio",
      owner: "João",
      status: "Aceita"
    },
    {
      id: 3,
      material: "Álgebra Linear",
      owner: "Ana",
      status: "Finalizada"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="requests-page">

        <h1>Minhas Solicitações</h1>

        {requests.map(request => (

          <div
            key={request.id}
            className="request-item"
          >

            <h3>{request.material}</h3>

            <p>
              Proprietário:
              {" "}
              {request.owner}
            </p>

            <span>
              {request.status}
            </span>

          </div>

        ))}

      </div>
    </>
  );
}