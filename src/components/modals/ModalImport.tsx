import ReactDOM from "react-dom";
import { useModal } from "@/context/ModalContext";
import BoxImportIcon from "@icons/BoxImportIcon";
import CloseIcon from "@icons/CloseIcon";
import FileDropZone from "@components/FileDropZone";

export function ModalImport() {
  const { setModal } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleExportStatistics = () => {
    window.electronAPI.signupSuccess();
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
            <BoxImportIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>Import your products</h2>
              <p className="font-extralight">
                Data will be import in a{" "}
                <span className="font-semibold">.csv</span> y{" "}
                <span className="font-semibold">.xlsx</span> file.
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4">
          <p>Your file must include the following columns:</p>
          <ul className="list-disc pl-5">
            <li>
              <strong>code_sku</strong>
            </li>
            <li>
              <strong>product</strong>
            </li>
            <li>
              <strong>category</strong>
            </li>
            <li>
              <strong>cost_price</strong>
            </li>
            <li>
              <strong>unit_price</strong>
            </li>
            <li>
              <strong>stock</strong>
            </li>
          </ul>

          <FileDropZone />
        </div>
      </div>
    </div>,
    modalRoot
  );
}
