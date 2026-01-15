import React from "react";
import LoginForm from "@/components/forms/form-login";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import CustomSelect from "@components/Select";

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const handleLogin = () => {
    window.electronAPI.loginSuccess();
  };

  const optionsLanguage = [
    { label: t("settings.input1_option1"), value: "en" },
    { label: t("settings.input1_option2"), value: "es" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-center items-center overflow-hidden gap-5 absolute inset-0 z-10 bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#F57C00_100%)]">
        <div className="absolute right-2 top-2">
          <CustomSelect
            options={optionsLanguage}
            color="#F57C00"
            placeholder={t("placeholders.language")}
            value={i18n.language}
            onChange={handleLanguageChange}
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <img src={fidelogoc} alt="" className="w-20" />
          <h1>{t("login.title")}</h1>
          <p className="font-extralight">{t("login.subtitle")}</p>
        </div>
        <div className="w-[450px]">
          <LoginForm onSuccess={handleLogin} />
        </div>
      </div>
    </>
  );
};

export default Login;
