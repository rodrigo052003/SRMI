import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "./MyMaterials.css";


export default function MyMaterials() {

  const [materials, setMaterials] =
  useState([]);

  useEffect(() => {

  fetch(
    "http://127.0.0.1:5000/materials"
  )

    .then(response =>
      response.json()
    )

    .then(data => {

      setMaterials(data);

    });

}, []);


const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Deseja remover?"
    );

  if (!confirmDelete)
    return;

  const token =
    localStorage.getItem(
      "token"
    );

  try {

    await fetch(

      `http://127.0.0.1:5000/materials/${id}`,

      {

        method: "DELETE",

        headers: {

          Authorization:
          `Bearer ${token}`

        }

      }

    );

    setMaterials(

      materials.filter(

        material =>
          material.id !== id

      )

    );

  } catch (error) {

    console.error(error);

  }

};


  return (
    <>
      <Navbar />

      <div className="materials-page">

        <div className="materials-header">

          <div>

            <h1>Meus Materiais</h1>

            <p>
              Gerencie seus materiais acadêmicos.
            </p>

          </div>

          <Link to="/material/new">

            <button className="add-material-btn">
              + Novo Material
            </button>

          </Link>

        </div>

        <div className="materials-search">

          <input
            type="text"
            placeholder="Pesquisar material..."
          />

        </div>

        <div className="materials-grid">

          {materials.map(material => (

            <div
              key={material.id}
              className="material-card"
            >

              <div className="material-info">

                <h3>
                  {material.title}
                </h3>

                <p>
                  Qualidade:
                  <strong>
                    {" "}
                    {material.quality}
                  </strong>
                </p>

                <p>
                  Tipo:
                  <strong>
                    {" "}
                    {material.transaction}
                  </strong>
                </p>

                <span className="status-badge">
                  {material.status}
                </span>

              </div>

              <div className="material-actions">

                <Link
                  to={`/material/edit/${material.id}`}
                >
                  <button className="edit-btn">
                    Editar
                  </button>
                </Link>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(material.id)
                  }
                >
                  Remover
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}


