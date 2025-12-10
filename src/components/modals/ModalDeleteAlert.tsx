import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import DeleteAlertIcon from "@icons/DeleteAlertIcon";

export function ModalDeleteAlert() {
  const { setModal } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleAlertDelete = () => {
    window.electronAPI.signupSuccess();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-30">
      <div
        className="w-[400px] flex flex-col p-5 gap-2 bg-white rounded-[15px] border-2 border-[#D32F2F] drop-shadow-[5px_5px_10px_rgba(211,47,47,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <div className="size-[100px] rounded-full bg-[#D32F2F]/20 flex items-center justify-center">
            <div className="size-20 rounded-full bg-[#D32F2F]/20 flex items-center justify-center shadow">
              <DeleteAlertIcon color="#D32F2F" size={40} />
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center">
            <p className="font-semibold text-3xl text-[#D32F2F]">Delete</p>
            <p className="font-extralight">
              Are you sure you want delete this VAR?
            </p>
            <p className="font-extralight">This action cannot be undone.</p>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="w-full flex justify-between gap-2">
          <button className="w-full bstrokered" onClick={close}>
            CANCEL
          </button>
          <button className="w-full bred" onClick={close}>
            CONFIRM
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
