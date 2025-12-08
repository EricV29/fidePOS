import React from "react";
import LoginForm from "@components/example-form-login";
import fidelogoc from "@img/fidelogoc.png";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.electronAPI.loginSuccess();
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center overflow-hidden gap-5 absolute inset-0 z-10 bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#F57C00_100%)]">
        <div className="w-full flex flex-col justify-center items-center">
          <img src={fidelogoc} alt="" className="w-20" />
          <h1>Log In</h1>
          <p className="font-extralight">
            Hello, enter your information to access.
          </p>
        </div>
        <div className="w-[450px]">
          <LoginForm onSuccess={handleLogin} />
        </div>
      </div>
    </>
  );
};

export default Login;
