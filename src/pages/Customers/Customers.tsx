import React from "react";
import ExportIcon from "@/assets/icons/ExportIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import PayIcon from "@/assets/icons/PayFillIcon";
import Switch from "@/components/Switch";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface CustomersProps {}

const Customers: React.FC<CustomersProps> = ({}) => {
  const navigate = useNavigate();
  const optionsCustomers = [
    { label: "General", value: "general" },
    { label: "Payments", value: "payments" },
  ];
  const currentTab =
    optionsCustomers.find((op) => location.pathname.includes(op.value))
      ?.value || optionsCustomers[0].value;

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
            <button className="bnormal">
              <PayIcon /> <p>Payment</p>
            </button>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <Switch
          options={optionsCustomers}
          active={currentTab}
          onChange={(value) => navigate(`./${value}`)}
        />
        <div className="flex-1 w-full h-full min-h-0 pt-3">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Customers;
