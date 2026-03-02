import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import UserPlusIcon from "@icons/UserPlusIcon";
import CloseIcon from "@icons/CloseIcon";
import AddCustomerForm from "@forms/form-addCustomer";
import { useTranslation } from "react-i18next";
import type { AddCustomerFormValues } from "@forms/schemas/customer.schema";
import { useLoading } from "@context/LoadingContext";
import type { Customers } from "@typesm/customers";
import AUTH_CODES from "../../../constants/authCodes.json";

type CustomerComparation = Pick<Customers, "name" | "last_name" | "phone">;

interface Props {
  data?: Customers;
  onSuccess: () => void;
}

export function ModalAddCustomer({ data, onSuccess }: Props) {
  const { setModal } = useModal();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { triggerResponseAlert } = useModal();

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const editCustomer = async (finalValues: CustomerComparation) => {
    const response = await window.electronAPI.editCustomer(finalValues);
    if (response.success) {
      onSuccess();
      setLoading(false);
      triggerResponseAlert(response.result);
    } else {
      setLoading(false);
      triggerResponseAlert(response.error);
    }
    return;
  };

  const handleAddCustomer = async (
    value: AddCustomerFormValues,
    editActive: boolean,
  ) => {
    setLoading(true);

    if (!editActive) {
      const response = await window.electronAPI.addCustomer(value);
      if (response.success) {
        onSuccess();
        setLoading(false);
        triggerResponseAlert(response.result);
      } else {
        setLoading(false);
        triggerResponseAlert(response.error);
      }
    } else {
      const id = data?.id;
      const name = data?.name;
      const last_name = data?.last_name;
      const phone = data?.phone;
      const originalData = { id, name, last_name, phone };
      const hasChanged = (
        Object.keys(originalData) as Array<keyof CustomerComparation>
      ).some((key) => originalData[key] !== value[key]);

      if (!hasChanged) {
        triggerResponseAlert(AUTH_CODES.NOT_CHANGES);
      } else {
        editCustomer(value);
      }
    }
    setLoading(false);
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
              <h2>
                {data
                  ? t("modalAddCustomer.title_edit")
                  : t("modalAddCustomer.title")}
              </h2>
              <p className="font-extralight">
                {data
                  ? t("modalAddCustomer.description_edit")
                  : t("modalAddCustomer.description")}
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">
          {data
            ? t("modalAddCustomer.subtitle_edit")
            : t("modalAddCustomer.subtitle")}{" "}
        </p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 dark:text-[#b3b3b3]">
          <AddCustomerForm data={data} onSuccess={handleAddCustomer} />
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
