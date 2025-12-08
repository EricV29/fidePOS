import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExportIcon from "@icons/ExportIcon";
import UserPlusIcon from "@icons/UserPlusIcon";
import PayIcon from "@icons/PayIcon";
import Switch from "@components/Switch";
import { Outlet } from "react-router-dom";
import { useModal } from "@/context/ModalContext";
import { ModalAddCustomer } from "@/components/modals/ModalAddCustomer";
import { ModalExport } from "@modals/ModalExport";

interface CustomersProps {}

const Customers: React.FC<CustomersProps> = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const optionsCustomers = [
    { label: "General", value: "general" },
    { label: "Payments", value: "payments" },
  ];
  const currentSegment = location.pathname.split("/").pop();
  const currentTab =
    optionsCustomers.find((op) => op.value === currentSegment)?.value ||
    optionsCustomers[0].value;
  const { setModal } = useModal();

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1>Customers</h1>
          <div className="flex gap-2">
            <button
              className="bnormal"
              onClick={() =>
                setModal(<ModalExport data={{ data: "Products Statistics" }} />)
              }
            >
              <ExportIcon /> <p>Export</p>
            </button>
            <button
              className="bnormal"
              onClick={() => setModal(<ModalAddCustomer />)}
            >
              <UserPlusIcon /> <p>Customer</p>
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
