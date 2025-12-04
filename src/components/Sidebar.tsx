import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@icons/MenuIcon";
import DashIcon from "@icons/DashboardIcon";
import ShopCarIcon from "@icons/ShoppingCar";
import BoxIcon from "@icons/BoxIcon";
import RepIcon from "@icons/ReportIcon";
import CustIcon from "@icons/CustomerIcon";
import SettIcon from "@icons/SettingsIcon";
import LogoutIcon from "@icons/LogoutIcon";
import Sidebaitem from "@components/SidebarItem";
import userImage from "@img/user.webp";
import fidelogoc from "@img/fidelogoc.png";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
}: SidebarProps) => {
  const handleLogout = () => {
    window.electronAPI.logoutSuccess();
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <aside
        className={`
        h-full bg-[#ffffff] rounded-[30px] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)] flex flex-col justify-between items-center
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
              <MenuIcon size={30} color="#5D5D5D" />
            </button>
          </div>
          <div className="h-auto w-full flex flex-col justify-start items-center gap-2.5">
            <Sidebaitem
              icon={DashIcon}
              label="Dashboard"
              active={location.pathname === "/main/dashboard"}
              onClick={() => navigate("/main/dashboard")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={ShopCarIcon}
              label="New Sale"
              active={location.pathname === "/main/newsale"}
              onClick={() => navigate("/main/newsale")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={BoxIcon}
              label="Products"
              active={location.pathname === "/main/products"}
              onClick={() => navigate("/main/products")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={CustIcon}
              label="Customers"
              active={location.pathname.startsWith("/main/customers")}
              onClick={() => navigate("/main/customers")}
              isOpen={isOpen}
            />
            <Sidebaitem
              icon={RepIcon}
              label="Reports"
              active={location.pathname.startsWith("/main/reports")}
              onClick={() => navigate("/main/reports")}
              isOpen={isOpen}
            />

            <Sidebaitem
              icon={SettIcon}
              label="Settings"
              active={location.pathname === "/main/settings"}
              onClick={() => navigate("/main/settings")}
              isOpen={isOpen}
            />
          </div>
        </div>
        <div className="h-auto w-auto flex flex-col justify-center items-center 2xl:gap-[50px] gap-5">
          <div className="flex flex-col items-center text-center">
            <img
              src={userImage}
              alt="ImgUser"
              className="size-[57px] rounded-full object-cover"
            />
            {isOpen && (
              <>
                <h1 className="mb-0 break-all block">User</h1>
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
