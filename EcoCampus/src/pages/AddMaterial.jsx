import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";




export default function AddMaterial() {

  const navigate = useNavigate();


  const [title, setTitle] = useState("");
  const [quality, setQuality] = useState("A");
  const [transaction, setTransaction] = useState("Troca");
  const [category, setCategory] =
  useState("Livro");

  async function handleSubmit() {

  const token = localStorage.getItem(
    "token"
  );

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/materials",
      {

        method: "POST",

        headers: {

          "Content-Type":
          "application/json",

          "Authorization":
          `Bearer ${token}`

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

    alert("Material cadastrado!");

    navigate("/marketplace");

  } catch (error) {

    console.error(error);

  }

}

  return (
    <>
      <Navbar />

      <div className="form-page">

        <div className="form-card">

          <h1>Cadastrar Material</h1>

          <input
             placeholder="Título"
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

          <button onClick={handleSubmit}>
            Cadastrar Material
          </button>

        </div>

      </div>
    </>
  );
}

