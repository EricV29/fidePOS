import React from "react";
import ProfileForm from "@/components/example-form-signup";
import fidelogoc from "@img/fidelogoc.png";

const Signup: React.FC = () => {
  const handleSignup = () => {
    window.electronAPI.signupSuccess();
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center overflow-hidden gap-5 absolute inset-0 z-10 bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#F57C00_100%)]">
        <div className="w-full flex flex-col justify-center items-center">
          <img src={fidelogoc} alt="" className="w-20" />
          <h1>Create Account</h1>
          <p className="font-extralight">
            Welcome to FidePOS, your ideal point of view for you bussiness.
          </p>
        </div>
        <div className="w-[450px]">
          <ProfileForm onSuccess={handleSignup} />
        </div>
      </div>
    </>
  );
};

export default Signup;
