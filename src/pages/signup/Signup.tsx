import React from "react";
import ProfileForm from "@components/forms/form-signup";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import CustomSelect from "@components/Select";
import type { AddUserFormValues } from "@forms/schemas/user.schema";
import { useModal } from "@context/ModalContext";

const Signup: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { triggerWarningAlert } = useModal();

  const handleSignup = (data: AddUserFormValues) => {
    window.electronAPI.signup(data, i18n.language);
  };

  const optionsLanguage = [
    { label: t("settings.input1_option1"), value: "en" },
    { label: t("settings.input1_option2"), value: "es" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  const handleFactoryReset = () => {
    triggerWarningAlert(t("login.reset_warning"), async () => {
      try {
        await window.electronAPI.factoryReset();
      } catch (err) {
        console.error("Comunication Error:", err);
      }
    });
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
          <h1>{t("signup.title")}</h1>
          <p className="font-extralight">{t("signup.subtitle")}</p>
        </div>
        <div className="w-[450px]">
          <ProfileForm onSuccess={handleSignup} />
        </div>
        <button
          onClick={handleFactoryReset}
          className="absolute bottom-3 left-4 text-xs font-light text-gray-500/60 hover:text-red-600 transition-colors"
        >
          {t("login.reset_data")}
        </button>
      </div>
    </>
  );
};

export default Signup;
