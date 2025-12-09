import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import CategoryIcon from "@icons/CategoryIcon";
import CloseIcon from "@icons/CloseIcon";
import AddCategoryForm from "@forms/form-addCategory";

export function ModalAddCategory() {
  const { setModal } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleAddCategory = () => {
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
            <CategoryIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>Add new category</h2>
              <p className="font-extralight">
                Add news cateogries to your database.
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p>Enter the main information of your new category.</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4">
          <AddCategoryForm onSuccess={handleAddCategory} />
        </div>
      </div>
    </div>,
    modalRoot
  );
}
