import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import SuccessIcon from "@icons/SuccessIcon";

export function ModalSuccessAlert() {
  const { setModal } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleSuccessAlert = () => {
    window.electronAPI.signupSuccess();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center items-center z-30">
      <div
        className="w-[400px] flex flex-col p-5 gap-2 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#43A047] drop-shadow-[5px_5px_10px_rgba(67,170,71,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <div className="size-[100px] rounded-full bg-[#43A047]/20 flex items-center justify-center">
            <div className="size-20 rounded-full bg-[#43A047]/20 flex items-center justify-center shadow">
              <SuccessIcon color="#43A047" size={40} />
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center">
            <p className="font-semibold text-3xl text-[#43A047]">Success</p>
            <p className="font-extralight dark:text-white">
              Action is donde successfully!
            </p>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <button className="bgreen" onClick={close}>
          CONFIRM
        </button>
      </div>
    </div>,
    modalRoot
  );
}
