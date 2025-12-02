import React from "react";
import ExportIcon from "@/assets/icons/ExportIcon";
import DatePicker from "@/components/DatePicker";
import { useInstallDate } from "../hooks/useInstallDate";
import Switch from "@/components/Switch";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface ReportsProps {}

const Reports: React.FC<ReportsProps> = ({}) => {
  const { installDate } = useInstallDate();
  const navigate = useNavigate();
  const location = useLocation();
  const last = location.pathname.split("/").pop();
  const activeTab = last === "sales" ? 1 : 0;

  if (!installDate) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1>Reports</h1>
          <div className="flex gap-2">
            <button className="bnormal">
              <ExportIcon /> <p>Export</p>
            </button>
            <DatePicker installDate={installDate} />
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <Switch
          opa="General"
          opb="Sales"
          active={activeTab}
          onChange={(index) => {
            navigate(index === 0 ? "general" : "sales");
          }}
        />
        <div className="flex-1 w-full h-full min-h-0 pt-3">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Reports;
