import ReactDOM from "react-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@context/ModalContext";
import CloseIcon from "@icons/CloseIcon";
import EyeIcon from "@icons/EyeIcon";
import EyeOffIcon from "@icons/EyeOffIcon";

interface Props {
  onConfirm: () => void;
}

const ModalAdminPassword = ({ onConfirm }: Props) => {
  const { setModal, triggerResponseAlert } = useModal();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const close = () => setModal(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      triggerResponseAlert("INCORRECT_PASSWORD");
      return;
    }

    try {
      const adminResponse = await window.electronAPI.getAdminId();
      if (!adminResponse.success || !adminResponse.id) {
        triggerResponseAlert("USER_NOT_FOUND");
        return;
      }

      const verifyResponse = await window.electronAPI.verifyUserPassword({
        userId: adminResponse.id,
        password,
      });

      if (verifyResponse.success) {
        close();
        onConfirm();
      } else {
        triggerResponseAlert(verifyResponse.error);
      }
    } catch (err) {
      console.error("Communication Error:", err);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-30 bg-black/10 backdrop-blur-sm">
      <div
        className="w-[400px] flex flex-col p-5 gap-2 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#b3b3b3] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center dark:text-[#b3b3b3]">
          <h2>{t("login.reset_data")}</h2>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p className="dark:text-white">{t("login.reset_warning")}</p>
          <div className="flex flex-col gap-1">
            <label className="dark:text-white font-semibold text-sm">
              {t("loginModal.admin_password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="inputtexto w-full pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOffIcon color="#F57C00" />
                ) : (
                  <EyeIcon color="#F57C00" />
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="bred">
            {t("buttons.btn_ok")}
          </button>
        </form>
      </div>
    </div>,
    modalRoot,
  );
};

export default ModalAdminPassword;
