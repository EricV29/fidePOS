import React, { useEffect, useState } from "react";
import userImage from "@img/user.webp";
import ImgIcon from "@icons/ImgIcon";
import CustomSelect from "@components/Select";
import LockedIcon from "@icons/LockedIcon";
import ShieldIcon from "@icons/ShieldIcon";
import UserPlusIcon from "@icons/UserPlusIcon";
import { DataTableSearch } from "@components/data-table-search";
import { columnsU } from "@columns/columnsU";
import type { Users } from "@typesm/users";
import { useModal } from "@context/ModalContext";
import { ModalAddUser } from "@modals/ModalAddUser";
import { ModalChangePassword } from "@modals/ModalChangePassword";
import { ModalContact } from "@modals/ModalContact";
import { useTranslation } from "react-i18next";

interface SettingsProps {}

//* Example data users
const dataUsersDB = [
  {
    id: "728ed51f",
    name: "Eric",
    last_name: "Villeda",
    email: "ericjared29@gmail.com",
    phone: "7713940793",
    password: "12345",
    role: "admin",
    status: "active",
    created_at: "03/03/2025",
  },
  {
    id: "728ed51f",
    name: "Eric",
    last_name: "Villeda",
    email: "ericjared29@gmail.com",
    phone: "7713940793",
    password: "12345",
    role: "user",
    status: "active",
    created_at: "03/03/2025",
  },
];

const Settings: React.FC<SettingsProps> = ({}) => {
  const [dataUsers, setUsers] = useState<Users[]>([]);
  const { setModal } = useModal();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setUsers(dataUsersDB);
  }, []);

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
  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px] mb-0">{t("settings.title")}</h1>
          <div className="flex gap-2">
            <button
              className="bnormal"
              onClick={() => setModal(<ModalAddUser />)}
            >
              <UserPlusIcon />
              <p>{t("settings.btn_add_user")}</p>
            </button>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="w-full flex flex-col gap-5 p-5 overflow-y-auto">
          <div className="w-full flex gap-3">
            <img
              src={userImage}
              alt="ImgUser"
              className="size-[57px] rounded-full object-cover"
            />
            <div className="flex flex-col justify-center items-start">
              <button className="bblack">
                <ImgIcon color="#fff" />
                <p>{t("settings.btn_change_img")}</p>
              </button>
              <p className="font-extralight">{t("settings.btn_place")}</p>
            </div>
            <button className="bwhite">
              <p>{t("settings.btn_remove_img")}</p>
            </button>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">{t("settings.input1")}</p>
              <p className="font-extralight">{t("settings.description1")}</p>
            </div>
            <div>
              <CustomSelect
                options={optionsLanguage}
                color="#000"
                placeholder={t("settings.place1")}
                value={i18n.language}
                onChange={handleLanguageChange}
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">{t("settings.input2")}</p>
              <p className="font-extralight">{t("settings.description2")}</p>
            </div>
            <div>
              <CustomSelect
                options={optionsTheme}
                color="#000"
                placeholder={t("settings.place2")}
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">{t("settings.input3")}</p>
              <p className="font-extralight">{t("settings.description3")}</p>
            </div>
            <button
              className="bgreen"
              onClick={() => setModal(<ModalChangePassword />)}
            >
              <LockedIcon />
              <p>{t("settings.input3_btn")}</p>
            </button>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">{t("settings.input4")}</p>
              <p className="font-extralight">{t("settings.description4")}</p>
            </div>
            <button className="bred" onClick={() => setModal(<ModalContact />)}>
              <ShieldIcon />
              <p>{t("settings.input4_btn")}</p>
            </button>
          </div>
          <div className="w-full min-h-[500px] flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold">{t("settings.table1")}</p>
            <DataTableSearch
              data={dataUsers}
              columns={columnsu}
              actions={{
                view: true,
                edit: true,
                delete: true,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
