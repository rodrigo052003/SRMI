import Navbar from "../components/Navbar";
import "./Help.css";

export default function Help() {

  return (
    <>
      <Navbar />

      <div className="help-page">

        <h1>Central de Ajuda</h1>

        <div className="faq-item">

          <h3>
            Como solicitar um material?
          </h3>

          <p>
            Entre no Marketplace e clique
            em "Solicitar".
          </p>

        </div>

        <div className="faq-item">

          <h3>
            Como cadastrar um material?
          </h3>

          <p>
            Vá em Meus Materiais e clique
            em Novo Material.
          </p>

        </div>

        <div className="faq-item">

          <h3>
            Como funciona a reputação?
          </h3>

          <p>
            Usuários recebem pontos por
            boas práticas dentro da
            plataforma.
          </p>

        </div>

      </div>
    </>
  );
}