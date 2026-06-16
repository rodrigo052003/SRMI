import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import "./AddMaterial.css";

export default function EditMaterial() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [title, setTitle] =
   useState("Cálculo Vol. 1 - Stewart");


  const [category, setCategory] =
    useState("Livro"); 

  const [quality, setQuality] =
    useState("A");

  const [transaction, setTransaction] =
   useState("Troca");

  async function handleSave() {
   
    console.log("ID:", id);

  const token =
    localStorage.getItem(
      "token"
    );
    console.log("TOKEN DO LOCALSTORAGE:", token);

  try {

    const response = await fetch(
  `http://127.0.0.1:5000/materials/${id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      category,
      quality,
      transaction
    })
  }
);

    const data =
      await response.json();

    console.log(data);

    alert(
      "Material atualizado!"
    );

    navigate(
      "/my-materials"
    );

    window.location.reload();

  } catch (error) {

    console.error(error);

  }

}

  return (
    <>
      <Navbar />

      <div className="form-page">

        <div className="form-card">

          <h1>Editar Material</h1>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Descrição"
          />

          <select 
            value={category}
            onChange={(e) =>
             setCategory(e.target.value)
            }
          >
            <option>Livro</option>
            <option>Calculadora</option>
            <option>Apostila</option>
          </select>

          <select 
            value={quality}
            onChange={(e) =>
              setQuality(e.target.value)
            }
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <select 
            value={transaction}
            onChange={(e) =>
              setTransaction(e.target.value)
            }
          >
            <option>Troca</option>
            <option>Empréstimo</option>
            <option>Doação</option>
          </select>

          <button onClick={handleSave}>
            Salvar Alterações
          </button>

        </div>

      </div>
    </>
  );
}