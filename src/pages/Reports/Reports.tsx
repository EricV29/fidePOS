import { useRef, useState } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import ExportIcon from "@icons/ExportIcon";
import DatePicker from "@components/DatePicker";
import Switch from "@components/Switch";
import { Outlet } from "react-router-dom";
import { useModal } from "@context/ModalContext";
import { ModalExport } from "@modals/ModalExport";
import { useTranslation } from "react-i18next";
import type { ExportReportValue } from "@typesm/global";
interface MyContext {
  installDate: string;
}

interface ExportableChild {
  createReport: () => Promise<ExportReportValue[][]>;
}

const Reports = () => {
  const { installDate } = useOutletContext<MyContext>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setModal } = useModal();
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    startDate: installDate
      ? new Intl.DateTimeFormat("sv-SE").format(new Date(installDate))
      : today,
    endDate: today,
  });

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

  const childRef = useRef<ExportableChild>(null);

  const handleDateChange = (
    startDate: string | null,
    endDate: string | null,
  ) => {
    const newFilters = {
      startDate: startDate || "",
      endDate: endDate || "",
    };
    setFilters(newFilters);
  };

  if (!installDate) return null;

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1>{t("reports.title")}</h1>
          <div className="flex gap-2">
            <button
              className="bnormal"
              onClick={async () => {
                if (childRef.current) {
                  const dataExport = await childRef.current.createReport();

                  if (dataExport.length > 0) {
                    setModal(<ModalExport page="REPORTS" data={dataExport} />);
                  }
                }
              }}
            >
              <ExportIcon /> <p>{t("buttons.btn_export")}</p>
            </button>
            <DatePicker installDate={installDate} onApply={handleDateChange} />
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <Switch
          options={optionsReports}
          active={currentTab}
          onChange={(value) => navigate(`./${value}`)}
        />
        <div className="flex-1 w-full h-full min-h-0 pt-3">
          <Outlet context={{ filters, childRef }} />
        </div>
      </div>
    </>
  );
};

export default Reports;
