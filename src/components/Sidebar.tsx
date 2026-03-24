import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@icons/MenuIcon";
import DashIcon from "@icons/DashboardIcon";
import ShopCarIcon from "@icons/ShoppingCar";
import BoxIcon from "@icons/BoxIcon";
import CheckListIcon from "@icons/CheckListIcon";
import RepIcon from "@icons/ReportIcon";
import CustIcon from "@icons/CustomerIcon";
import SettIcon from "@icons/SettingsIcon";
import LogoutIcon from "@icons/LogoutIcon";
import Sidebaitem from "@components/SidebarItem";
import fidelogoc from "@img/fidelogoc.png";
import { useTranslation } from "react-i18next";
import type { UserSession } from "@typesm/users";
import { getAvatar } from "@utility/getAvatar";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  session: UserSession | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  session,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [fallbackAvatar] = useState(getAvatar);
  const displayImage = session?.img
    ? `fide-pos://${session.img}`
    : fallbackAvatar;

  const handleLogout = () => {
    window.electronAPI.logout();
  };

  const roles = [
    { label: t("global.role_admin"), value: 1 },
    { label: t("global.role_user"), value: 2 },
  ];

  const roleMatched = roles.find((role) => role.value === session?.role_id);

  const nameUser =
    session?.name.split(" ")[0] + " " + session?.last_name.split(" ")[0];

  return (
    <>
      <aside
        className={`
        h-full bg-[#ffffff] rounded-[30px] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)] flex flex-col justify-between items-center dark:bg-[#353935]
        ${isOpen ? "w-[200px] px-[15px] py-5" : "w-[70px] px-[5px] py-[15px]"}
      `}
      >
        <div className="w-full h-auto flex flex-col justify-center items-center gap-[30px]">
          <div
            className={`h-[60px] w-full flex items-center ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >
            {isOpen && (
              <img src={fidelogoc} alt="LogoFidePOS" className="h-12 block " />
            )}
            <button
              className="transition-transform duration-200 hover:scale-110 hover:-translate-y-0.5"
              onClick={toggleSidebar}
            >
              <MenuIcon
                size={30}
                className="text-[#5D5D5D] dark:text-[#b3b3b3]"
              />
            </button>
          </div>
          <div className="h-auto w-full flex flex-col justify-start items-center gap-2.5">
            <Sidebaitem
              icon={DashIcon}
              label={t("sidebar.dashboard")}
              active={location.pathname === "/main/dashboard"}
              onClick={() => navigate("/main/dashboard")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={ShopCarIcon}
              label={t("sidebar.newSale")}
              active={location.pathname === "/main/newsale"}
              onClick={() => navigate("/main/newsale")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={BoxIcon}
              label={t("sidebar.products")}
              active={location.pathname === "/main/products"}
              onClick={() => navigate("/main/products")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={CheckListIcon}
              label={t("sidebar.history")}
              active={location.pathname === "/main/history"}
              onClick={() => navigate("/main/history")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={CustIcon}
              label={t("sidebar.customers")}
              active={location.pathname.startsWith("/main/customers")}
              onClick={() => navigate("/main/customers")}
              isOpen={isOpen}
            />
            {session?.role_id !== 2 && (
              <Sidebaitem
                icon={RepIcon}
                label={t("sidebar.reports")}
                active={location.pathname.startsWith("/main/reports")}
                onClick={() => navigate("/main/reports")}
                isOpen={isOpen}
              />
            )}
            <Sidebaitem
              icon={SettIcon}
              label={t("sidebar.settings")}
              active={location.pathname === "/main/settings"}
              onClick={() => navigate("/main/settings")}
              isOpen={isOpen}
            />
          </div>
        </div>
        <div className="h-auto w-auto flex flex-col justify-center items-center 2xl:gap-[50px] gap-5">
          <div className="flex flex-col items-center text-center">
            <img
              src={displayImage}
              alt="ImgUser"
              title={nameUser}
              className={`rounded-full object-cover ${
                isOpen ? "size-[60px]" : "size-[35px]"
              }`}
            />
            {isOpen && (
              <>
                <p className="font-bold text-[#F57C00] text-[20px] mb-0">
                  {nameUser}
                </p>
                <p className="text-[15px] text-[#5D5D5D] dark:text-[#B3B3B3] block">
                  {roleMatched?.label}
                </p>
              </>
            )}
          </div>
          <button
            className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-1"
            onClick={handleLogout}
          >
            <LogoutIcon size={30} color="#F57C00" />
            {isOpen && (
              <p className="text-[#F57C00] font-semibold block">
                {t("sidebar.logout")}
              </p>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
