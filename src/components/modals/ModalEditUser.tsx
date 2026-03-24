import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import UserPlusIcon from "@icons/UserPlusIcon";
import CloseIcon from "@icons/CloseIcon";
import EditUserForm from "@forms/form-editUser";
import { useTranslation } from "react-i18next";
import type { EditUserFormValues } from "@forms/schemas/user.schema";
import type { Users } from "@typesm/users";
import { useLoading } from "@context/LoadingContext";

interface ModalEditUserProps {
  data?: Users;
  onSuccess: () => void;
}

const ModalEditUser = ({ data, onSuccess }: ModalEditUserProps) => {
  const { setModal } = useModal();
  const { t } = useTranslation();
  const { triggerResponseAlert } = useModal();
  const { setLoading } = useLoading();
  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleEditUser = async (data: EditUserFormValues) => {
    setLoading(true);
    const response = await window.electronAPI.editUser(data);
    if (response.success) {
      onSuccess();
      setLoading(false);
      triggerResponseAlert(response.result);
    } else {
      setLoading(false);
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
            <UserPlusIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>{t("modalEditUser.title")}</h2>
              <p className="font-extralight">
                {t("modalEditUser.description")}
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">{t("modalEditUser.subtitle")}</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 dark:text-[#b3b3b3]">
          <EditUserForm onSuccess={handleEditUser} data={data} />
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

export default ModalEditUser;
