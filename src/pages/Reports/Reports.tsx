import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExportIcon from "@icons/ExportIcon";
import DatePicker from "@components/DatePicker";
import { useInstallDate } from "@hooks/useInstallDate";
import Switch from "@components/Switch";
import { Outlet } from "react-router-dom";
import { useModal } from "@/context/ModalContext";
import { ModalExport } from "@modals/ModalExport";
import { useTranslation } from "react-i18next";

interface ReportsProps {}

const Reports: React.FC<ReportsProps> = ({}) => {
  const { installDate } = useInstallDate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setModal } = useModal();
  const { t } = useTranslation();

  const reportOptions = [
    { value: "general" },
    { value: "sales" },
    { value: "products" },
    { value: "customers" },
  ] as const;

  const optionsReports = reportOptions.map((option) => ({
    value: option.value,
    label: t(`reports.switch.${option.value}`),
  }));

  const currentSegment = location.pathname.split("/").pop();
  const currentTab =
    optionsReports.find((op) => op.value === currentSegment)?.value ||
    optionsReports[0].value;

  if (!installDate) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1>{t("reports.title")}</h1>
          <div className="flex gap-2">
            <button
              className="bnormal"
              onClick={() =>
                setModal(<ModalExport data={{ data: "Products Statistics" }} />)
              }
            >
              <ExportIcon /> <p>{t("reports.btn_export")}</p>
            </button>
            <DatePicker installDate={installDate} />
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <Switch
          options={optionsReports}
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

export default Reports;
