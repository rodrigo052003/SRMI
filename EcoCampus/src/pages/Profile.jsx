import Navbar from "../components/Navbar";

export default function Profile() {

  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-card">

          <h1>
            Carlos Eduardo
          </h1>

          <p>
            Universidade Federal
          </p>

          <p>
            Licenciatura em Matemática
          </p>

          <hr />

          <h3>
            Estatísticas
          </h3>

          <p>
            Materiais cadastrados: 12
          </p>

          <p>
            Trocas realizadas: 8
          </p>

          <p>
            Empréstimos realizados: 5
          </p>

        </div>

      </div>
    </>
  );
}