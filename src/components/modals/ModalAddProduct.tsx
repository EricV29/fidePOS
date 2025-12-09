import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import BoxPlusIcon from "@icons/BoxPlusIcon";
import CloseIcon from "@icons/CloseIcon";
import AddProductForm from "@forms/form-addProduct";

export function ModalAddProduct() {
  const { setModal } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleAddProduct = () => {
    //window.electronAPI.signupSuccess();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex justify-center items-center z-30 bg-white/30 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-[500px] flex flex-col p-5 gap-2 bg-white rounded-[15px] border-2 border-[#b3b3b3] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-5">
            <BoxPlusIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>Add new product</h2>
              <p className="font-extralight">
                Add individual products to your product list.
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p>Enter the main information of your new product.</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4">
          <AddProductForm onSuccess={handleAddProduct} />
        </div>
      </div>
    </div>,
    modalRoot
  );
}
