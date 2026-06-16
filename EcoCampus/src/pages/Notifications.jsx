import Navbar from "../components/Navbar";
import "./Notifications.css";

export default function Notifications() {

  const notifications = [

    "Maria solicitou seu livro de Física.",

    "João aceitou sua proposta de troca.",

    "Ana avaliou você com 5 estrelas.",

    "Seu empréstimo vence amanhã."

  ];

  return (
    <>
      <Navbar />

      <div className="notifications-page">

        <h1>Notificações</h1>

        {notifications.map((item, index) => (

          <div
            key={index}
            className="notification-item"
          >
            {item}
          </div>

        ))}

      </div>
    </>
  );
}