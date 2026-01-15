import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import WarningIcon from "@icons/WarningIcon";
import { useTranslation } from "react-i18next";

interface Props {
  text: string;
  btnOptions: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
}

const ModalWarningAlert = ({
  text,
  btnOptions,
  onConfirm,
  onCancel,
  onOk,
}: Props) => {
  const { setModal } = useModal();
  const { t } = useTranslation();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    close();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    close();
  };

  const handleOk = () => {
    if (onOk) onOk();
    close();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-30">
      <div
        className="w-[400px] flex flex-col p-5 gap-2 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#FFC107] drop-shadow-[5px_5px_10px_rgba(255,193,7,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <div className="size-[100px] rounded-full bg-[#FFC107]/20 flex items-center justify-center">
            <div className="size-20 rounded-full bg-[#FFC107]/20 flex items-center justify-center shadow">
              <WarningIcon color="#FFC107" size={40} />
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center text-center">
            <p className="font-semibold text-3xl text-[#FFC107]">
              {t("modalWarningAlert.title")}
            </p>
            <p className="font-extralight dark:text-white">{text}</p>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />

        {btnOptions ? (
          <div className="w-full flex justify-between gap-2">
            <button className="w-full bstrokeyellow" onClick={handleCancel}>
              {t("buttons.btn_cancel")}
            </button>
            <button className="w-full byellow" onClick={handleConfirm}>
              {t("buttons.btn_confirm")}
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-between gap-2">
            <button className="w-full byellow" onClick={handleOk}>
              {t("buttons.btn_ok")}
            </button>
          </div>
        )}
      </div>
    </div>,
    modalRoot
  );
};

export default ModalWarningAlert;
