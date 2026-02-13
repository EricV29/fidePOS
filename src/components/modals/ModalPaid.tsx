import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import ShoppingCarFillIcon from "@icons/ShoppingCarFillIcon";
import CloseIcon from "@icons/CloseIcon";
import { useTranslation } from "react-i18next";
import { currencyFormat } from "@utility/currencyFormat";
import BarCodeIcon from "@icons/BarCodeIcon";
import type { SaleData } from "@typesm/sales";
import AUTH_CODES from "../../../constants/authCodes.json";

interface ModalPaidProps {
  data: SaleData;
  onSuccess: (data: SaleData) => void;
}

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

export function ModalPaid({ data, onSuccess }: ModalPaidProps) {
  const { setModal } = useModal();
  const { t, i18n } = useTranslation();
  const [dataNewSale, setDataNewSale] = useState<SaleData>();
  const { triggerWarningAlert, triggerResponseAlert } = useModal();
  const [isCreditActive, setIsCreditActive] = useState(false);
  const [changeDue, setChangeDue] = useState(0);

  useEffect(() => {
    if (data) {
      const initializedData = {
        ...data,
        products: data.products.map((item) => ({
          ...item,
          credit: item.credit ?? false,
        })),
      };
      setDataNewSale(initializedData);
    }
  }, [data]);

  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const toggleProductSelection = (id: string | number) => {
    setDataNewSale((prev) => {
      if (!prev) return prev;

      const updatedProducts = prev.products.map((item) =>
        String(item.id) === String(id)
          ? { ...item, credit: !item.credit }
          : item,
      );

      const hasCredit = updatedProducts.some((item) => item.credit);
      setIsCreditActive(hasCredit);

      if (!hasCredit) {
        const input = document.getElementById(
          "paid_amount",
        ) as HTMLInputElement;
        if (input) {
          input.value = "";
        }
      }

      return {
        ...prev,
        products: prev.products.map((item) =>
          String(item.id) === String(id)
            ? { ...item, credit: !item.credit }
            : item,
        ),
      };
    });
  };

  const handleCompleteSale = async () => {
    if (!dataNewSale) return;

    const paid_amount =
      parseFloat(
        (document.getElementById("paid_amount") as HTMLInputElement)?.value,
      ) || 0;
    const cash_received =
      parseFloat(
        (document.getElementById("cash_received") as HTMLInputElement)?.value,
      ) || 0;

    if (isCreditActive) {
      if (paid_amount > 0) {
        if (cash_received < paid_amount) {
          triggerResponseAlert(AUTH_CODES.INSUFFICIENT_AMOUNT);
          return;
        }
      } else if (cash_received > 0) {
        if (cash_received > paid_amount) {
          triggerResponseAlert(AUTH_CODES.INSUFFICIENT_AMOUNT);
          return;
        }
      }

      if (paid_amount < dataNewSale.total) {
        triggerWarningAlert(
          t("modalWarningAlert.text_complete_new_sale"),
          async () => {
            setDataNewSale(
              (data = {
                ...dataNewSale,
                paid_amount: paid_amount,
                credit: true,
              }),
            );
            onSuccess(data);
            setModal(null);
          },
        );
      } else {
        triggerResponseAlert(AUTH_CODES.NOT_CREDIT_SALE);
      }
    } else {
      if (cash_received >= dataNewSale.total) {
        triggerWarningAlert(
          t("modalWarningAlert.text_complete_new_sale"),
          async () => {
            setDataNewSale(
              (data = { ...dataNewSale, paid_amount: dataNewSale.total }),
            );
            onSuccess(data);
            setModal(null);
          },
        );
      } else {
        triggerResponseAlert(AUTH_CODES.INSUFFICIENT_AMOUNT);
      }
    }
  };

  const handleChangeDue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const received = parseFloat(e.target.value) | 0;
    if (dataNewSale?.total) {
      const change = received - dataNewSale.total;
      setChangeDue(change);
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
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-5">
            <ShoppingCarFillIcon size={40} color="#F57C00" />
            <div className="flex flex-col dark:text-[#b3b3b3]">
              <h2>
                {t("modalNewPaid.title")} #{dataNewSale?.nextNumberSale}
              </h2>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">{t("modalNewPaid.subtitle")}</p>
        <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4">
          <div className="w-full flex justify-between dark:text-[#b3b3b3]">
            <div className="flex gap-1">
              {dataNewSale?.nextNumberSale && (
                <>
                  <p>{t("modalNewPaid.customer")}</p>{" "}
                  <p className="font-semibold">{dataNewSale?.nextNumberSale}</p>
                </>
              )}
            </div>
          </div>
          <div className="w-full max-h-[280px] overflow-y-auto flex flex-col gap-2 dark:text-white">
            {dataNewSale?.products.map((item) => (
              <div
                key={item.id}
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
                    {currencyFormat(item.total_amount)}
                  </p>
                  <p className="font-extralight text-[15px]">
                    {currencyFormat(item.unit_price)}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={!!item.credit}
                  onChange={() => toggleProductSelection(item.id)}
                  className="cursor-pointer w-5 h-5 accent-[#F57C00]"
                />
              </div>
            ))}
          </div>
          <div className="w-full">
            <div className="w-full flex justify-between dark:text-[#b3b3b3]">
              <p>Subtotal</p>
              <p className="font-semibold">
                {dataNewSale
                  ? currencyFormat(dataNewSale.total)
                  : t("global.loading")}
              </p>
            </div>
            <div className="w-full flex justify-between dark:text-[#b3b3b3]">
              <p>{t("modalNewPaid.discount")}</p>
              <p className="font-semibold">
                {dataNewSale
                  ? currencyFormat(dataNewSale.discount)
                  : t("global.loading")}
              </p>
            </div>
            <hr className="border border-[#b3b3b3] my-1" />
            <div className="w-full flex justify-between bg-[#F57C00] dark:bg-[#F57C00] dark:text-white px-2 rounded-[7px]">
              <p>Total</p>
              <p className="font-semibold">
                {dataNewSale
                  ? currencyFormat(dataNewSale.total)
                  : t("global.loading")}
              </p>
            </div>
            <div className="w-full flex justify-between bg-[#FFEFDE] dark:bg-[#5f5f5f] dark:text-white px-2 rounded-[7px]">
              <p>{t("modalNewPaid.change_due")}</p>
              <p className="font-semibold">
                {dataNewSale ? currencyFormat(changeDue) : t("global.loading")}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col">
              <p className="dark:text-white">
                {t("modalNewPaid.input_paid_amount")}
              </p>
              <div className="inputtexto">
                <input
                  id="paid_amount"
                  type="number"
                  min={0}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder={t("modalNewPaid.input_paid_amount")}
                  className="w-full h-full"
                  disabled={!isCreditActive}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="dark:text-white">
                {t("modalNewPaid.input_cash_received")}
              </p>
              <div className="inputtexto">
                <input
                  id="cash_received"
                  type="number"
                  min={0}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder={t("modalNewPaid.input_cash_received")}
                  className="w-full h-full"
                  onChange={handleChangeDue}
                />
              </div>
            </div>
          </div>
          <button className="borange" onClick={handleCompleteSale}>
            {t("modalNewPaid.btn")}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
