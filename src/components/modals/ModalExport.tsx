import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import ChartBarIcon from "@icons/ChartBarIcon";
import CloseIcon from "@icons/CloseIcon";
import CustomSelect from "@components/Select";
import { useTranslation, Trans } from "react-i18next";
import { useState } from "react";
import AUTH_CODES from "../../../constants/authCodes.json";
import { exportReportFile } from "@/utility/exportReportFile";
import type { dataExportProducts } from "@typesm/products";

interface Data {
  page: string;
  data: dataExportProducts[][];
}

export function ModalExport({ page, data }: Data) {
  const { setModal, triggerResponseAlert } = useModal();
  const { t } = useTranslation();
  const [isTrue, setIsTrue] = useState<boolean | null>(null);
  const [selectedFormatId, setSelecteFormatId] = useState<string | undefined>();
  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleExportStatistics = async () => {
    if (!selectedFormatId) {
      triggerResponseAlert(AUTH_CODES.NOT_SELECTED_FORMAT);
      return;
    }

    if (isTrue !== true && isTrue !== false) {
      triggerResponseAlert(AUTH_CODES.NOT_SELECTED_STATISTICS);
      return;
    }

    exportReportFile(selectedFormatId, data, page, isTrue);
  };

  const optionsExport = [
    { label: ".CSV", value: "csv" },
    { label: ".XLSX", value: "xlsx" },
    { label: ".PDF", value: "pdf" },
  ];

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex justify-center items-center z-30 bg-black/10 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-[500px] flex flex-col p-5 gap-2 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#b3b3b3] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center dark:text-[#b3b3b3]">
          <div className="flex gap-5">
            <ChartBarIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>{t("modalExport.title")}</h2>
              <p className="font-extralight">
                <Trans
                  i18nKey="modalExport.description"
                  components={{
                    bold: <span className="font-semibold" />,
                  }}
                />
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">{t("modalExport.subtitle")}</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 dark:text-[#b3b3b3]">
          <div className="w-full flex justify-between items-center">
            <div className="w-full">
              <p className="font-semibold">
                {t("modalExport.text_statistics")}
              </p>
              <p className="font-extralight">
                {t("modalExport.text_statistics_description")}
              </p>
            </div>
            <div className="w-[100px] flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="selection-group"
                  value="true"
                  checked={isTrue === true}
                  onChange={() => setIsTrue(true)}
                  className="cursor-pointer"
                />
                <span className="group-hover:text-[#F57C00] transition-colors">
                  {t("global.yes")}
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="selection-group"
                  value="false"
                  checked={isTrue === false}
                  onChange={() => setIsTrue(false)}
                  className="cursor-pointer"
                />
                <span className="group-hover:text-[#F57C00] transition-colors">
                  NO
                </span>
              </label>
            </div>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="w-full">
              <p className="font-semibold">{t("modalExport.text_format")}</p>
              <p className="font-extralight">
                {t("modalExport.text_format_description")}
              </p>
            </div>
            <CustomSelect
              options={optionsExport}
              color="#F57C00"
              placeholder={t("placeholders.format")}
              onChange={(value) => setSelecteFormatId(value)}
              value={selectedFormatId}
            />
          </div>
          <button className="borange" onClick={handleExportStatistics}>
            {t("modalExport.form_btn")}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
