import React from "react";
import back from "@img/backgroundfidepos.png";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import EmailForm from "@forms/form-email";
import CustomSelect from "@components/Select";

const Welcome: React.FC = () => {
  const { t, i18n } = useTranslation();
  const optionsLanguage = [
    { label: t("settings.input1_option1"), value: "en" },
    { label: t("settings.input1_option2"), value: "es" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  const handleEmail = () => {
    console.log("Email");
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center overflow-hidden gap-5 p-5 relative inset-0 z-10 bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#F57C00_100%)]">
        <div className="absolute right-2 top-2 z-200">
          <CustomSelect
            options={optionsLanguage}
            color="#F57C00"
            placeholder={t("placeholders.language")}
            value={i18n.language}
            onChange={handleLanguageChange}
          />
        </div>
        <div className="w-full h-[150px] flex justify-center items-center gap-5 px-10 animate-fade-up animate-once animation-duration-[2000ms]">
          <img
            src={fidelogoc}
            alt=""
            className="w-[150px]"
            style={{
              filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.6))",
            }}
          />
        </div>
        <div className="w-full h-full flex justify-between p-3 gap-10 animate-fade-up animate-once animation-duration-[2000ms]">
          <div
            className="w-1/2 rounded-2xl p-5 bg-white flex flex-col justify-start items-center"
            style={{
              filter: "drop-shadow(-3px 5px 4px rgba(0,0,0,0.5))",
            }}
          >
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {t("start.option1")}
            </h2>
            <ul className="space-y-3 py-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">🌐</span>
                <span>{t("start.description1")}</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">🔑</span>
                <span>
                  {t("start.description2")}
                  <a
                    href="https://www.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 px-3 py-1 bg-[#f57c00]/15 text-[#f57c00] text-xs font-bold rounded-full hover:bg-[#f57c00]/30 transition-colors border border-[#f57c00]"
                  >
                    <span>{t("start.btn_tutorial")}</span>
                  </a>
                </span>
              </li>
            </ul>
            <div className="w-full">
              <EmailForm onSuccess={handleEmail} />
            </div>
          </div>
          <div
            className="w-1/2 rounded-2xl p-5 bg-white flex flex-col justify-start items-center"
            style={{
              filter: "drop-shadow(-3px 5px 4px rgba(0,0,0,0.5))",
            }}
          >
            <h2 className="text-center font-bold flex items-center gap-2">
              Tengo una Base de Datos
            </h2>

            <p className="text-sm">Selecciona tu archivo .db:</p>

            <p className="text-sm">
              Ingresa tus credenciales de tu base de datos:
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
