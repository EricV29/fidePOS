import React, { useState } from "react";
import KeysForm from "@/components/forms/form-keys";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import CustomSelect from "@components/Select";
import type { KeysFormValues } from "@forms/schemas/keys.schema";
import { useModal } from "@context/ModalContext";
import ModalWarningAlert from "@modals/ModalWarningAlert";
import AUTH_CORES from "../../../constants/authCodes.json";

interface DatabaseKeys {
  db_password: string;
  db_salt: string;
}

const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { triggerWarningAlert, triggerResponseAlert } = useModal();
  const [keys, setKeys] = useState<DatabaseKeys>();

  const handleKeys = async (data: KeysFormValues) => {
    try {
      const response = await window.electronAPI.assingKeys(data);
      if (response.success) {
        await window.electronAPI.successAppKeys();
      } else {
        triggerResponseAlert(AUTH_CORES.INCORRECT_KEYS);
      }
    } catch (err) {
      console.error("Comunication Error:", err);
    }
  };

  const handleNewDB = async () => {
    try {
      const response = await window.electronAPI.newDB();

      const keysData =
        typeof response.result === "string"
          ? JSON.parse(response.result)
          : response.result;

      if (keysData.keys) {
        setKeys(keysData.keys);
      }
    } catch (err) {
      console.error("Comunication Error:", err);
    }
  };

  const handleStartApp = async () => {
    try {
      window.electronAPI.startApp();
    } catch (err) {
      console.error("Comunication Error:", err);
    }
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
          <h1>{t("keys.title")}</h1>
          <p className="font-extralight w-[460px] text-center">
            {t("keys.subtitle1")}
          </p>
        </div>

        <div className="w-[450px]">
          {!keys && <KeysForm onSuccess={handleKeys} />}
        </div>

        <div className="w-[450px] flex flex-col justify-center items-center">
          <button className="bgreen" onClick={handleNewDB} disabled={!!keys}>
            <p className="font-extralight">{t("keys.text1")}</p>
          </button>
          <p className="w-[460px] text-center font-extralight ">
            {t("keys.text2")}
          </p>
          {keys && (
            <div className="mt-4 p-4 flex flex-col justify-center gap-2 bg-[#f57c0020] border border-orange-200 rounded-lg">
              <p className="font-bold mb-2">{t("keys.text3")}</p>
              <p className="text-xs font-bold text-[#D32F2F] italic">
                * {t("keys.text_save_keys")}
              </p>

              <div className="space-y-2 text-sm font-mono bg-white p-3 rounded border">
                <p>
                  <strong>{t("keys.text_pass_db")}</strong> {keys.db_password}
                </p>
                <p>
                  <strong>{t("keys.salt_db")}</strong> {keys.db_salt}
                </p>
              </div>

              <button
                className="bgreen"
                onClick={handleStartApp}
                disabled={!keys}
              >
                <p className="font-extralight">{t("keys.btn2")}</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
