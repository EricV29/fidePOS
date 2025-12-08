import ReactDOM from "react-dom";
import { useModal } from "@/context/ModalContext";
import UserPlusIcon from "@icons/UserPlusIcon";
import AddCustomerForm from "@components/form-addCustomer";

interface Customer {
  name: string;
}

export function ModalAddCustomer({ customer }: { customer: Customer }) {
  const { setModal } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleAddCustomer = () => {
    window.electronAPI.signupSuccess();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex justify-center items-center z-30 bg-white/30 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-[700px] flex flex-col p-5 gap-2 bg-white rounded-[15px] border-2 border-[#b3b3b3]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between">
          <div className="flex gap-5">
            <UserPlusIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>Add New Customer</h2>
              <p className="font-extralight leading-0">
                Add individual clients to your customers list.
              </p>
            </div>
          </div>
          <button className="bnormal" onClick={close}>
            <h2>X</h2>
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="w-full flex flex-col rounded-[10px] border-2 border-[#b3b3b3] p-5">
          <h2>{customer.name}</h2>
          <p>Enter the main information of your new customer.</p>
          <AddCustomerForm onSuccess={handleAddCustomer} />
        </div>
      </div>
    </div>,
    modalRoot
  );
}
