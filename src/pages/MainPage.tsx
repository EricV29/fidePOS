import { useEffect, useState } from "react";

export default function MainPage() {
  const [msgReply, setMsgReply] = useState("");
  const [msgReplyPrivate, setMsgReplyPrivate] = useState("");

  useEffect(() => {
    // GLOBAL LISTENER REPLY
    window.electronAPI.onMessageReply((data) => {
      setMsgReply(data);
    });

    // GLOBAL LISTENER PRIVATE
    window.electronAPI.onMessageReplyPrivate((data) => {
      setMsgReplyPrivate(data);
    });
  }, []);

  const sendMessage = () => {
    window.electronAPI.sendMessage("Hello from Main!");
  };

  const sendMessagePrivate = () => {
    window.electronAPI.sendMessagePrivate("Hello from Main Private!");
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <h1>Main window</h1>
        <button onClick={sendMessage}>Enviar mensaje global</button>
        <p>Respuesta global: {msgReply}</p>

        <button onClick={sendMessagePrivate}>Enviar mensaje privado</button>
        <p>Respuesta privada: {msgReplyPrivate}</p>
      </div>
    </>
  );
}
