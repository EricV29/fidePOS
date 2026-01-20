import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import UnlockedIcon from "@icons/UnlockedIcon";
import CloseIcon from "@icons/CloseIcon";
import ChangePasswordForm from "@forms/form-changePassword";
import { useTranslation } from "react-i18next";
import type { ChangePasswordFormValues } from "@forms/schemas/user.schema";

interface Props {
  id: number | undefined;
}

const ModalChangePassword = ({ id }: Props) => {
  const { setModal } = useModal();
  const { t } = useTranslation();
  const { triggerResponseAlert } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    const dataC = { ...data, id: id };
    const response = await window.electronAPI.changePassword(dataC);
    if (response.success) {
      triggerResponseAlert(response.result);
    } else {
      triggerResponseAlert(response.error);
    }
  };

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
            <UnlockedIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>{t("modalChangePassword.title")}</h2>
              <p className="font-extralight">
                {t("modalChangePassword.description")}
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">{t("modalChangePassword.subtitle")}</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 dark:text-[#b3b3b3]">
          <ChangePasswordForm onSuccess={handleChangePassword} />
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

export default ModalChangePassword;
