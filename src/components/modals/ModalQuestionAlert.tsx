import ReactDOM from "react-dom";
import WarningIcon from "@icons/WarningIcon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { Option } from "@typesm/products";

interface Props {
  mainText: string;
  options: Option[];
  onConfirm: (selectedId: string) => void;
  onClose: () => void;
}

const ModalQuestionAlert = ({
  mainText,
  options,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>(options[0]?.id || "");
  const modalRoot = document.getElementById("alert-root") as HTMLElement;
  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-100 bg-black/50 backdrop-blur-sm">
      <div className="w-[450px] flex flex-col p-6 gap-4 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#FFC107] shadow-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="size-16 rounded-full bg-[#FFC107]/20 flex items-center justify-center">
            <WarningIcon color="#FFC107" size={32} />
          </div>
          <div className="text-center">
            <p className="font-bold text-2xl text-[#FFC107] leading-none mb-1">
              {t("modalQuestionAlert.title")}
            </p>
            <p className="text-gray-600 dark:text-gray-300 px-2">{mainText}</p>
          </div>
        </div>

        <hr className="border-[#b3b3b3]/30" />

        <div className="flex flex-col gap-3 my-2">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selected === option.id
                  ? "border-[#FFC107] bg-[#FFC107]/5"
                  : "border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <input
                type="radio"
                name="option-inventario"
                className="mt-1 accent-[#FFC107] size-4"
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm dark:text-white uppercase">
                  {option.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </span>
              </div>
            </label>
          ))}
        </div>

        <div className="w-full flex justify-between gap-3 mt-2">
          <button className="w-full bstrokeyellow py-3" onClick={onClose}>
            {t("buttons.btn_cancel")}
          </button>
          <button className="w-full byellow py-3" onClick={handleConfirm}>
            {t("buttons.btn_confirm")}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

export default ModalQuestionAlert;
