import { useState, useEffect } from "react";
import MarketplaceCard from "../components/MarketplaceCard";
import Navbar from "../components/Navbar";


import "./Marketplace.css";

export default function Marketplace() {

  <Navbar />

  const [search, setSearch] = useState("");

  const [materials, setMaterials] = useState([]);

  const filteredMaterials =
    materials.filter(material =>
      material.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    useEffect(() => {

      fetch("http://127.0.0.1:5000/materials")

        .then(response => response.json())

        .then(data => {

           setMaterials(data);

        })

       .catch(error => {

          console.error(
          "Erro ao carregar materiais:",
          error
        );

    });

}, []);

  return (
   <>
    <Navbar />

    <div className="marketplace">

      <div className="marketplace-header">

        <h1>Marketplace</h1>

        <input
          type="text"
          placeholder="Pesquisar materiais..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="filters">

        <select>
          <option>Todas Categorias</option>
          <option>Livros</option>
          <option>Calculadoras</option>
          <option>Apostilas</option>
        </select>

        <select>
          <option>Todas Qualidades</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>

        <select>
          <option>Todas Transações</option>
          <option>Troca</option>
          <option>Doação</option>
          <option>Empréstimo</option>
        </select>

      </div>

      <div className="market-grid">

        {filteredMaterials.map(material => (
          <MarketplaceCard
            key={material.id}
            material={material}
          />
        ))}

      </div>

    </div>
   </>
  );
}