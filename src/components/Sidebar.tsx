import React from "react";
import { useState } from "react";
import MenuIcon from "../assets/icons/MenuIcon";
import DashIcon from "../assets/icons/DashboardIcon";
import ShopCarIcon from "../assets/icons/ShoppingCar";
import BoxIcon from "../assets/icons/BoxIcon";
import RepIcon from "../assets/icons/ReportIcon";
import CustIcon from "../assets/icons/CustomerIcon";
import SettIcon from "../assets/icons/SettingsIcon";
import LogoutIcon from "../assets/icons/LogoutIcon";
import Sidebaitem from "./SidebarItem";
import userImage from "../assets/images/user.webp";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
}: SidebarProps) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const handleLogout = () => {
    window.electronAPI.logoutSuccess();
  };

  return (
    <>
      <aside
        className={`
        h-full bg-[#ffffff] rounded-[30px] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)] flex flex-col justify-between items-center
        ${
          isOpen
            ? "w-[200px] px-[15px] py-[20px]"
            : "w-[70px] px-[5px] py-[15px]"
        }
      `}
      >
        <div className="w-full h-auto flex flex-col justify-center items-center gap-[30px]">
          <div
            className={`h-[60px] w-full flex items-center ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >
            {isOpen && (
              <img
                src="../../public/fidelogoc.png"
                alt="LogoFidePOS"
                className="h-[48px] block "
              />
            )}
            <button
              className="transition-transform duration-200 hover:scale-110 hover:-translate-y-[2px]"
              onClick={toggleSidebar}
            >
              <MenuIcon size={30} color="#5D5D5D" />
            </button>
          </div>
          <div className="h-auto w-full flex flex-col justify-start items-center gap-[10px]">
            <Sidebaitem
              icon={DashIcon}
              label="Dashboard"
              active={activeItem === "dashboard"}
              onClick={() => setActiveItem("dashboard")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={ShopCarIcon}
              label="New Sale"
              active={activeItem === "newSale"}
              onClick={() => setActiveItem("newSale")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={BoxIcon}
              label="Products"
              active={activeItem === "products"}
              onClick={() => setActiveItem("products")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={RepIcon}
              label="Reports"
              active={activeItem === "reports"}
              onClick={() => setActiveItem("reports")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={CustIcon}
              label="Customers"
              active={activeItem === "customers"}
              onClick={() => setActiveItem("customers")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={SettIcon}
              label="Settings"
              active={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
              isOpen={isOpen}
            />
          </div>
        </div>
        <div className="h-auto w-auto flex flex-col justify-center items-center 2xl:gap-[50px] gap-[20px]">
          <div className="flex flex-col items-center text-center">
            <img
              src={userImage}
              alt="ImgUser"
              className="size-[57px] rounded-full object-cover"
            />
            {isOpen && (
              <>
                <h1 className="text-[#F57C00] mb-0 break-all block">User</h1>
                <p className="text-[#5D5D5D] block">Rol</p>
              </>
            )}
          </div>
          <button
            className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-1"
            onClick={handleLogout}
          >
            <LogoutIcon size={30} color="#F57C00" />
            {isOpen && (
              <p className="text-[#F57C00] font-semibold block">Logout</p>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
