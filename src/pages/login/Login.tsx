import React from "react";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.electronAPI.loginSuccess();
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <h1>Login</h1>
        <button onClick={handleLogin}>Entrar</button>
      </div>
    </>
  );
};

export default Login;
