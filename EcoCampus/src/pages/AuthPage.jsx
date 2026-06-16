import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">
          <h1>UniTroca</h1>
          <p>
            Compartilhe materiais acadêmicos com outros estudantes.
          </p>
        </div>

        <div className="auth-switch">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Entrar
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Cadastrar
          </button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

      </div>

    </div>
  );
}

function LoginForm() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            email,
            password

          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem(
          "token",
          data.token
        );

        navigate("/dashboard");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.error(error);

      alert("Erro ao conectar com servidor.");

    }

  }

  return (

    <form
      className="auth-form"
      onSubmit={handleLogin}
    >

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button type="submit">

        Entrar

      </button>

    </form>

  );

}

function RegisterForm() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleRegister(e) {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/register",
        {

          method: "POST",

          headers: {

            "Content-Type":
            "application/json"

          },

          body: JSON.stringify({

            name,

            email,

            password

          })

        }
      );

      const data =
        await response.json();

      alert(data.message);

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao cadastrar."
      );

    }

  }

  return (

    <form
      className="auth-form"
      onSubmit={handleRegister}
    >

      <input
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button type="submit">

        Criar Conta

      </button>

    </form>

  );

}