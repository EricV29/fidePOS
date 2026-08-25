import React, { useState } from "react";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import KeysForm from "@forms/form-keys";
import CustomSelect from "@components/Select";
import DBFileInput from "@components/inputDB";
import { type KeysFormValues } from "@forms/schemas/keys.schema";
import AUTH_CODES from "../../constants/authCodes.json";
import { useModal } from "@context/ModalContext";

const Welcome: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { triggerResponseAlert } = useModal();

  const optionsLanguage = [
    { label: t("settings.input1_option1"), value: "en" },
    { label: t("settings.input1_option2"), value: "es" },
  ];
  const [file, setSelectedFile] = useState(String);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  // Start App (New Database)
  const handleStartApp = async () => {
    const response = await window.electronAPI.startAppFirst();

    if (!response.success) {
      triggerResponseAlert(response.error);
    }
  };

  // Start App File DB
  const handleSetDataBase = async (values: KeysFormValues) => {
    if (!file) {
      triggerResponseAlert(AUTH_CODES.NOT_SELECTED_FILE);
    } else {
      const response = await window.electronAPI.startAppFileDB({
        dbPath: file,
        values,
      });
      if (!response.success) {
        triggerResponseAlert(response.error);
      }
    }
  };

  const handleFileSelection = async (file: string) => {
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile("");
    }
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
        <div className="w-full h-37.5 flex justify-center items-center gap-5 px-10 animate-fade-up animate-once animation-duration-[2000ms]">
          <img
            src={fidelogoc}
            alt=""
            className="w-37.5"
            style={{
              filter: "drop-shadow(0px 5px 5px rgba(0,0,0,0.6))",
            }}
          />
        </div>
        <div className="w-full h-full flex justify-between p-3 gap-10 animate-fade-up animate-once animation-duration-[2000ms]">
          <div
            className="w-1/2 rounded-2xl p-5 bg-white flex flex-col justify-start items-center gap-4"
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
                <span>{t("start.description2")}</span>
              </li>
            </ul>
            <div className="w-full flex justify-center">
              <button onClick={handleStartApp} className="borange">
                {t("start.btn_start")}
              </button>
            </div>
          </div>
          <div
            className="w-1/2 rounded-2xl p-5 bg-white flex flex-col justify-start items-center gap-3"
            style={{
              filter: "drop-shadow(-3px 5px 4px rgba(0,0,0,0.5))",
            }}
          >
            <h2 className="text-center font-bold flex items-center gap-2">
              {t("start.option2")}
            </h2>
            <div className="w-full flex flex-col gap-2">
              <p>{t("start.description3")}</p>
              <DBFileInput path={file} onSelect={handleFileSelection} />
              <p>{t("start.description4")}</p>
              <KeysForm onSuccess={handleSetDataBase} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
