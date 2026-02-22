import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import BoxPlusIcon from "@icons/BoxPlusIcon";
import CloseIcon from "@icons/CloseIcon";
import AddProductForm from "@forms/form-addProduct";
import { useTranslation } from "react-i18next";
import type { Products } from "@typesm/products";
import type { AddProductFormValues } from "../forms/schemas/product.schema";
import { useLoading } from "@context/LoadingContext";

interface Props {
  data?: Products;
  onSuccess: () => void;
}

export function ModalAddProduct({ data, onSuccess }: Props) {
  const { setModal } = useModal();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const { triggerResponseAlert } = useModal();
  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleAddProduct = async (
    values: AddProductFormValues,
    editActive: boolean,
  ) => {
    setLoading(true);

    if (!editActive) {
      const response = await window.electronAPI.addProduct(values);
      if (response.success) {
        onSuccess();
        setLoading(false);
        triggerResponseAlert(response.result);
      } else {
        setLoading(false);
        triggerResponseAlert(response.error);
      }
    } else {
      console.log(values);
      const response = await window.electronAPI.editProduct(values);
      if (response.success) {
        onSuccess();
        setLoading(false);
        triggerResponseAlert(response.result);
      } else {
        setLoading(false);
        triggerResponseAlert(response.error);
      }
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
            <BoxPlusIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>
                {data
                  ? t("modalAddProduct.title_edit")
                  : t("modalAddProduct.title")}
              </h2>
              <p className="font-extralight">
                {data
                  ? t("modalAddProduct.description_edit")
                  : t("modalAddProduct.description")}
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">{t("modalAddProduct.subtitle")}</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 dark:text-[#b3b3b3]">
          <AddProductForm onSuccess={handleAddProduct} data={data} />
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
