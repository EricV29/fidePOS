import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ImgIcon from "@icons/ImgIcon";
import CustomSelect from "@components/Select";
import LockedIcon from "@icons/LockedIcon";
import ShieldIcon from "@icons/ShieldIcon";
import UserPlusIcon from "@icons/UserPlusIcon";
import { DataTableSearch } from "@components/data-table-search";
import { columnsU } from "@columns/columnsU";
import type { Users, UserSession } from "@typesm/users";
import { useModal } from "@context/ModalContext";
import ModalAddUser from "@modals/ModalAddUser";
import ModalChangePassword from "@modals/ModalChangePassword";
import { ModalContact } from "@modals/ModalContact";
import { useTranslation } from "react-i18next";
import { getAvatar } from "@utility/getAvatar";
import { useLoading } from "@context/LoadingContext";
import ModalEditUser from "@/components/modals/ModalEditUser";
import AUTH_CODES from "../../constants/authCodes.json";

interface SettingsProps {}

interface MyContext {
  session: UserSession;
  installDate: string;
}

const Settings: React.FC<SettingsProps> = ({}) => {
  const { session } = useOutletContext<MyContext>();
  const [dataUsers, setUsers] = useState<Users[]>([]);
  const { setModal } = useModal();
  const { t, i18n } = useTranslation();
  const [fallbackAvatar] = useState(getAvatar);
  const displayImage = session?.img
    ? `fide-pos://${session.img}`
    : fallbackAvatar;
  const { triggerWarningAlert, triggerResponseAlert } = useModal();
  const { setLoading } = useLoading();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  const getUsers = async () => {
    const response = await window.electronAPI.getUsers();
    if (response) {
      setUsers(response.result ?? []);
    }
  };

  useEffect(() => {
    if (session?.role_id !== 2) {
      getUsers();
    }

    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme, session?.role_id]);

  const columnsu = columnsU(t, i18n.language);

  const optionsLanguage = [
    { label: t("settings.input1_option1"), value: "en" },
    { label: t("settings.input1_option2"), value: "es" },
  ];

  const optionsTheme = [
    { label: t("settings.input2_option1"), value: "light" },
    { label: t("settings.input2_option2"), value: "dark" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  const deleteUser = async (id: number) => {
    if (session?.role_id !== 1) {
      triggerResponseAlert("UNAUTHORIZED");
    }

    triggerWarningAlert(t("modalWarningAlert.text_delete_user"), async () => {
      try {
        setLoading(true);
        const response = await window.electronAPI.deleteUser(id);
        if (response.success) {
          getUsers();
          setLoading(false);
          triggerResponseAlert(response.result);
        } else {
          setLoading(false);

          triggerResponseAlert(response.error);
        }
      } catch (err) {
        console.error("Comunication Error:", err);
      }
    });
  };

  const handleChangeTheme = (value: string) => {
    if (value === "light" || value === "dark") {
      setTheme(value);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleChangeImg = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!session?.id) return;
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/webp", "image/png"];
    if (!validTypes.includes(file.type)) {
      triggerResponseAlert(AUTH_CODES.IMAGE_INVALID);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      triggerResponseAlert(AUTH_CODES.IMAGE_LARGE);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const response = await window.electronAPI.uploadUserImage({
        userId: session.id,
        fileArrayBuffer: arrayBuffer,
        fileName: file.name,
      });
      if (response.success) {
        triggerResponseAlert(response.result);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px] mb-0">{t("settings.title")}</h1>
          {session?.role_id !== 2 && (
            <div className="flex gap-2">
              <button
                className="bnormal"
                onClick={() => setModal(<ModalAddUser onSuccess={getUsers} />)}
              >
                <UserPlusIcon />
                <p>{t("buttons.btn_add_user")}</p>
              </button>
            </div>
          )}
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="w-full flex flex-col gap-5 p-5 overflow-y-auto">
          <div className="w-full flex gap-3">
            <img
              src={displayImage}
              alt="ImgUser"
              className="size-[57px] rounded-full object-cover"
            />
            <div>
              <div className="flex">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleChangeImg}
                  style={{ display: "none" }}
                  accept="image/jpg, image/jpeg, image/webp"
                />
                <button className="bblack" onClick={handleButtonClick}>
                  <ImgIcon color="#fff" />
                  <p>{t("settings.btn_change_img")}</p>
                </button>
              </div>
              <p className="font-extralight dark:text-[#b3b3b3]">
                {t("placeholders.support_img")}
              </p>
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold dark:text-white">
                {t("settings.input1")}
              </p>
              <p className="font-extralight dark:text-[#b3b3b3]">
                {t("settings.description1")}
              </p>
            </div>
            <div>
              <CustomSelect
                options={optionsLanguage}
                color="#F57C00"
                placeholder={t("placeholders.language")}
                value={i18n.language}
                onChange={handleLanguageChange}
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold dark:text-white">
                {t("settings.input2")}
              </p>
              <p className="font-extralight dark:text-[#b3b3b3]">
                {t("settings.description2")}
              </p>
            </div>
            <div>
              <CustomSelect
                options={optionsTheme}
                color="#F57C00"
                placeholder={t("placeholders.theme")}
                value={theme}
                onChange={handleChangeTheme}
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold dark:text-white">
                {t("settings.input3")}
              </p>
              <p className="font-extralight dark:text-[#b3b3b3]">
                {t("settings.description3")}
              </p>
            </div>
            <button
              className="bgreen"
              onClick={() => setModal(<ModalChangePassword id={session?.id} />)}
            >
              <LockedIcon />
              <p>{t("settings.input3_btn")}</p>
            </button>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold dark:text-white">
                {t("settings.input4")}
              </p>
              <p className="font-extralight dark:text-[#b3b3b3]">
                {t("settings.description4")}
              </p>
            </div>
            <button
              className="bred"
              onClick={() => setModal(<ModalContact session={session} />)}
            >
              <ShieldIcon />
              <p>{t("settings.input4_btn")}</p>
            </button>
          </div>
          {session?.role_id !== 2 && (
            <div className="w-full min-h-[500px] flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
              <p className="font-semibold dark:text-white">
                {t("settings.table1")}
              </p>
              <DataTableSearch
                data={dataUsers}
                columns={columnsu}
                actions={{
                  onEdit: (row) => {
                    setModal(<ModalEditUser data={row} onSuccess={getUsers} />);
                  },
                  onDelete: (row) => {
                    deleteUser(row.id);
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
