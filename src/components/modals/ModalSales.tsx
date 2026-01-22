import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import ShoppingCarFillIcon from "@icons/ShoppingCarFillIcon";
import CloseIcon from "@icons/CloseIcon";
import { useTranslation } from "react-i18next";
import type { SaleModal, SaleView } from "@typesm/sales";
import { getStatusConfig } from "@utility/statusColumns";
import CalendarIcon from "@icons/CalendarIcon";
import { dateFormat } from "@utility/dateFormats";
import { currencyFormat } from "@utility/currencyFormat";
import BarCodeIcon from "@icons/BarCodeIcon";

type Props = {
  sale: SaleModal;
};

//* Example data sale
const dataSaleDB = [
  {
    sale: 1,
    products: [
      {
        product: "Carrito",
        unit_price: 100,
        quantity: 3,
        code_sku: "1294",
        subtotal: 300,
      },
      {
        product: "Pistola",
        unit_price: 50,
        quantity: 2,
        code_sku: "6341",
        subtotal: 100,
      },
    ],
    customer: "Eric",
    subtotal: 400,
    discount: 40,
  },
];

export function ModalSales({ sale }: Props) {
  const { setModal } = useModal();
  const { t, i18n } = useTranslation();
  const [dataSale, setDataSale] = useState<SaleView[]>([]);

  useEffect(() => {
    setDataSale(dataSaleDB);
  }, []);

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handleSales = () => {
    //window.electronAPI.signupSuccess();
  };

  console.log(dataSale);

  const { label, color } = getStatusConfig(sale.status, t);
  const date = dateFormat(sale.created_at, i18n.language);
  const total = currencyFormat(sale.total_amount);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex justify-center items-center z-30 bg-black/10 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-[500px] flex flex-col p-5 gap-2 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#b3b3b3] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-5">
            <ShoppingCarFillIcon size={40} color="#F57C00" />
            <div className="flex flex-col dark:text-[#b3b3b3]">
              <h2>
                {t("modalSale.title")} #{sale.num_sale}
              </h2>
              <p className="font-extralight">
                {t("modalSale.description")}{" "}
                <span className={color}>{label}</span>
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">{t("modalSale.subtitle")}</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4">
          <div className="w-full flex justify-between dark:text-[#b3b3b3]">
            <div className="flex gap-1">
              <CalendarIcon size={20} />
              <p>{date}</p>
            </div>
            <div className="flex gap-1">
              <p>{t("modalSale.customer")}</p>{" "}
              <p className="font-semibold">{dataSale[0]?.customer}</p>
            </div>
          </div>
          <div className="w-full max-h-[280px] overflow-y-auto flex flex-col gap-2 dark:text-white">
            {dataSale[0]?.products.map((item) => (
              <div
                key={item.code_sku}
                className="w-full flex justify-between bg-[#b3b3b330] px-3 py-1 rounded-[7px]"
              >
                <div>
                  <p className="font-bold text-[20px]">
                    {item.product}: {item.quantity}
                  </p>
                  <div className="flex gap-1 font-extralight">
                    <BarCodeIcon
                      size={20}
                      className="text-[#6B7280] dark:text-[#b3b3b3]"
                    />
                    {item.code_sku}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-bold text-[20px]">
                    {currencyFormat(item.subtotal)}
                  </p>
                  <p className="font-extralight text-[15px]">
                    {currencyFormat(item.unit_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full">
            <div className="w-full flex justify-between dark:text-[#b3b3b3]">
              <p>Subtotal</p>
              <p className="font-semibold">
                {currencyFormat(dataSale[0]?.subtotal)}
              </p>
            </div>
            <div className="w-full flex justify-between dark:text-[#b3b3b3]">
              <p>{t("modalSale.discount")}</p>
              <p className="font-semibold">
                {currencyFormat(dataSale[0]?.discount)}
              </p>
            </div>
            <hr className="border border-[#b3b3b3] my-1" />
            <div className="w-full flex justify-between bg-[#FFEFDE] dark:bg-[#5f5f5f] dark:text-white px-2 rounded-[7px]">
              <p>Total</p>
              <p className="font-semibold">{total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
