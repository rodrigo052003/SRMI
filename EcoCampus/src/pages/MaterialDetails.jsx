import Navbar from "../components/Navbar";

export default function MaterialDetails() {

  return (
    <>
      <Navbar />

      <div className="details-page">

        <div className="details-card">

          <div className="details-image">

            📚

          </div>

          <div>

            <h1>
              Livro de Álgebra Linear
            </h1>

            <p>
              Excelente estado de conservação.
            </p>

            <p>
              Qualidade: A
            </p>

            <p>
              Tipo: Troca
            </p>

            <p>
              Proprietário:
              Carlos Eduardo
            </p>

            <div className="details-actions">

              <button>
                Solicitar Troca
              </button>

              <button>
                Solicitar Empréstimo
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}