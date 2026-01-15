import React, { useEffect } from "react";
import LoginForm from "@/components/forms/form-login";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import CustomSelect from "@components/Select";
import type { LoginFormValues } from "@forms/schemas/user.schema";
import { useModal } from "@context/ModalContext";
import ModalWarningAlert from "@modals/ModalWarningAlert";

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setModal } = useModal();

  useEffect(() => {
    const unsubscribe = window.electronAPI.loginReply((response) => {
      if (response.success) {
        console.log(response.user);
      } else {
        console.error(response.error);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleLogin = (data: LoginFormValues) => {
    console.log(data);
    window.electronAPI.login(data);
  };

  const handleForgotPassword = () => {
    console.log("ddd");
    setModal(
      <ModalWarningAlert
        text={t("modalWarningAlert.text_forgot_password")}
        onConfirm={() => {
          console.log("Confirm");
        }}
        onCancel={() => console.log("Cancel")}
      />
    );
    //window.electronAPI.forgotPassword();
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
          <LoginForm
            onSuccess={handleLogin}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      </div>
    </>
  );
};

export default Login;
