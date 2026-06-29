import Navbar from "../components/Navbar";
import "./About.css";

export default function About() {

  return (
    <>
      <Navbar />

      <div className="about-page">

        <h1>Sobre o EcoCampus</h1>

        <div className="about-card">

          <p>

            O EcoCampus é uma plataforma
            criada para facilitar a troca,
            empréstimo e doação de materiais
            acadêmicos entre estudantes e
            professores.

          </p>

          <p>

            Nosso objetivo é reduzir custos,
            incentivar o reaproveitamento de
            recursos e fortalecer a colaboração
            dentro da comunidade universitária.

          </p>

        </div>

      </div>
    </>
  );
}