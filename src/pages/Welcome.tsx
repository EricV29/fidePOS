import React from "react";
import back from "@img/backgroundfidepos.png";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";

const Welcome: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-screen h-screen relative overflow-hidden bg-[#F57C00]">
        <img
          src={back}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-fade animate-once animation-duration-[2000ms]"
        />

        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
          <div className="w-full pl-28">
            <p className="text-white font-semibold text-2xl animate-fade-right animate-once animate-duration-1000">
              {t("global.welcome")}
            </p>
          </div>
          <img
            src={fidelogoc}
            alt=""
            className="w-[280px] animate-fade-up animate-once animation-duration-[2000ms]"
            style={{
              filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.6))",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Welcome;
