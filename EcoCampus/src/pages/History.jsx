import Navbar from "../components/Navbar";
import "./History.css";

export default function History() {

  const history = [

    {
      type: "Troca",
      material: "Livro de Álgebra",
      date: "05/06/2026"
    },

    {
      type: "Doação",
      material: "Livro de Física",
      date: "03/06/2026"
    },

    {
      type: "Empréstimo",
      material: "Calculadora Casio",
      date: "01/06/2026"
    }

  ];

  return (
    <>
      <Navbar />

      <div className="history-page">

        <h1>Histórico</h1>

        {history.map((item, index) => (

          <div
            key={index}
            className="history-item"
          >

            <h3>
              {item.type}
            </h3>

            <p>
              {item.material}
            </p>

            <small>
              {item.date}
            </small>

          </div>

        ))}

      </div>
    </>
  );
}