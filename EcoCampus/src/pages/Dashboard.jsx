import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import MaterialCard from "../components/MaterialCard";
import RequestCard from "../components/RequestCard";
import { Link } from "react-router-dom";

import "./Dashboard.css";

export default function Dashboard() {

  const materials = [
    {
      id: 1,
      title: "Livro de Álgebra Linear",
      quality: "A",
      status: "Disponível"
    },
    {
      id: 2,
      title: "Calculadora Científica",
      quality: "B",
      status: "Emprestado"
    },
    {
      id: 3,
      title: "Livro de Física I",
      quality: "A",
      status: "Disponível"
    }
  ];

  const requests = [
    {
      id: 1,
      user: "João Silva",
      material: "Livro de Álgebra Linear"
    },
    {
      id: 2,
      user: "Maria Souza",
      material: "Calculadora Científica"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <section className="hero">

          <h1>Olá, Carlos 👋</h1>

          <p>
            Compartilhe conhecimento e ajude outros estudantes.
          </p>

          <div className="hero-buttons">
            <Link to="/material/new">
                <button>
                     Cadastrar Material
                 </button>
            </Link>

            <Link to="/MarketPlace">
                <button className="secondary">
                  Explorar Marketplace
                </button>
            </Link>   

          </div>

        </section>

        <section className="stats">

          <DashboardCard
            value="12"
            title="Meus Materiais"
          />

          <DashboardCard
            value="5"
            title="Disponíveis"
          />

          <DashboardCard
            value="3"
            title="Solicitações"
          />

          <DashboardCard
            value="8"
            title="Trocas Concluídas"
          />

        </section>

        <section className="content">

          <div className="materials-section">

            <div className="section-header">
              <h2>Meus Materiais</h2>

              <input
                type="text"
                placeholder="Pesquisar material..."
              />
            </div>

            {materials.map(material => (
              <MaterialCard
                key={material.id}
                material={material}
              />
            ))}

          </div>

          <div className="requests-section">

            <h2>Solicitações Recentes</h2>

            {requests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
              />
            ))}

          </div>

        </section>

      </div>
    </>
  );
}