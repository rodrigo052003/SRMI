import Navbar from "../components/Navbar";
import "./Reputation.css";

export default function Reputation() {

  return (
    <>
      <Navbar />

      <div className="reputation-page">

        <h1>Reputação</h1>

        <div className="reputation-card">

          <h2>⭐ Usuário Confiável</h2>

          <h3>245 pontos</h3>

          <p>
            Sua reputação é baseada nas
            trocas, empréstimos e doações
            realizadas com sucesso.
          </p>

        </div>

        <div className="rules-card">

          <h2>Como ganhar pontos?</h2>

          <ul>

            <li>+10 pontos por doação</li>

            <li>+5 pontos por troca concluída</li>

            <li>+5 pontos por empréstimo concluído</li>

            <li>-10 pontos por denúncia válida</li>

          </ul>

        </div>

      </div>
    </>
  );
}