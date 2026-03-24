import React, { useEffect, useState } from "react";
import ProfileForm from "@components/forms/form-signup";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import CustomSelect from "@components/Select";
import type { AddUserFormValues } from "@forms/schemas/user.schema";

interface DatabaseKeys {
  db_password: string;
  db_salt: string;
}

const Signup: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [keys, setKeys] = useState<DatabaseKeys>();

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

  const copyAllKeys = () => {
    if (!keys) return;
    const textToCopy = `Password: ${keys.db_password}\nSalt: ${keys.db_salt}`;
    navigator.clipboard.writeText(textToCopy);
    // Opcional: alert("Copiado!");
  };

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await window.electronAPI.getKeys();

        if (response && response.keys) {
          setKeys(response.keys);
        }
      } catch (error) {
        console.error("❌ Error get keys:", error);
      }
    };

    fetchKeys();
  }, []);

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
        {keys && (
          <button
            onClick={copyAllKeys}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-orange-50 border border-orange-200 rounded-lg transition-all group shadow-sm"
          >
            <span className="text-sm font-medium text-orange-800">
              {t("signup.keys") || "Copiar llaves de seguridad"}
            </span>
          </button>
        )}
        <div className="w-[450px]">
          <ProfileForm onSuccess={handleSignup} />
        </div>
      </div>
    </>
  );
};

export default Signup;
