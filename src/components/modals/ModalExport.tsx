import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import ChartBarIcon from "@icons/ChartBarIcon";
import CloseIcon from "@icons/CloseIcon";
import CustomSelect from "@components/Select";
import { useTranslation, Trans } from "react-i18next";
interface Data {
  data: string;
}

export function ModalExport({ data }: { data: Data }) {
  const { setModal } = useModal();
  const { t } = useTranslation();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleExportStatistics = () => {
    window.electronAPI.signupSuccess();
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
        className="w-[500px] flex flex-col p-5 gap-2 bg-white rounded-[15px] border-2 border-[#b3b3b3] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center">
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
        <p>{data.data}</p>
        <p>{t("modalExport.subtitle")}</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4">
          <div className="w-full flex justify-between items-center">
            <div className="w-full">
              <p className="font-semibold">{t("modalExport.form_title")}</p>
              <p className="font-extralight">
                {t("modalExport.form_description")}
              </p>
            </div>
            <CustomSelect
              options={optionsExport}
              color="#000"
              placeholder={t("modalExport.form_input_place")}
            />
          </div>
          <button className="borange" onClick={handleExportStatistics}>
            {t("modalExport.form_btn")}
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
