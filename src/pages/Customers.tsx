import React from "react";
import ExportIcon from "@/assets/icons/ExportIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import Switch from "../components/Switch";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface CustomersProps {}

const Customers: React.FC<CustomersProps> = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const last = location.pathname.split("/").pop();
  const activeTab = last === "payments" ? 1 : 0;

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1>Customers</h1>
          <div className="flex gap-2">
            <button className="bnormal">
              <ExportIcon /> <p>Export</p>
            </button>
            <button className="bnormal">
              <PlusIcon /> <p>Customer</p>
            </button>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <Switch
          opa="General"
          opb="Payments"
          active={activeTab}
          onChange={(index) => {
            navigate(index === 0 ? "general" : "payments");
          }}
        />
        <div className="flex-1 w-full h-full min-h-0 p-3 bg-amber-200">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Customers;
