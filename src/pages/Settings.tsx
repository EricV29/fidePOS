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
import { useTranslation } from "react-i18next";

interface SettingsProps {}

const optionsLanguage = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
];

const optionsTheme = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

//* Example data users
const dataUsersDB = [
  {
    id: "728ed51f",
    name: "Eric",
    last_name: "Villeda",
    email: "ericjared29@gmail.com",
    phone: "7713940793",
    password: "12345",
    rol: "admin",
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
    rol: "user",
    status: "active",
    created_at: "03/03/2025",
  },
];

const Settings: React.FC<SettingsProps> = ({}) => {
  const [dataUsers, setUsers] = useState<Users[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    setUsers(dataUsersDB);
  }, []);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };
  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px] mb-0">Account Settings</h1>
          <div className="flex gap-2">
            <button className="bnormal">
              <UserPlusIcon /> <p>User</p>
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
                <p>Change image</p>
              </button>
              <p className="font-extralight">Support .jpg, .jpeg, y .web</p>
            </div>
            <button className="bwhite">
              <p>Remove image</p>
            </button>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">Language</p>
              <p className="font-extralight">
                Customize how you theams looks on your device.
              </p>
            </div>
            <div>
              <CustomSelect
                options={optionsLanguage}
                color="#000"
                placeholder="Language"
                value={i18n.language}
                onChange={handleLanguageChange}
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">Appareance</p>
              <p className="font-extralight">
                Customize how you theams looks on your device.
              </p>
            </div>
            <div>
              <CustomSelect
                options={optionsTheme}
                color="#000"
                placeholder="Theme"
              />
            </div>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">Password</p>
              <p className="font-extralight">Change your password.</p>
            </div>
            <button className="bgreen">
              <LockedIcon />
              <p>Change</p>
            </button>
          </div>
          <div className="w-full flex justify-start items-center gap-3">
            <div className="w-auto">
              <p className="font-semibold">Support</p>
              <p className="font-extralight">
                Report problems with the app developer.
              </p>
            </div>
            <button className="bred">
              <ShieldIcon />
              <p>Contact</p>
            </button>
          </div>
          <div className="w-auto">
            <p className="font-semibold">Users</p>
            <p className="font-extralight">Manage the app users.</p>
          </div>
          <div className="w-full min-h-[500px] flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-white">
            <p className="font-semibold">Users Table</p>
            <DataTableSearch
              data={dataUsers}
              columns={columnsU}
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
