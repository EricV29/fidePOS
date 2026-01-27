import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import PayIcon from "@icons/PayIcon";
import CloseIcon from "@icons/CloseIcon";
import NewPaymentForm from "@forms/form-newPayment";
import CustomSelect from "@components/Select";
import { DataTable } from "@components/data-table";
import { useState, useEffect, useMemo, useCallback } from "react";
import type {
  PaymentsDebt,
  AccountsReceivable,
  IndebtedCustomer,
  CustomerDebtsMin,
} from "@typesm/customers";
import { columnsPD } from "@columns/columnsPD";
import { useTranslation } from "react-i18next";
import { currencyFormat } from "@utility/currencyFormat";

interface Props {
  account?: AccountsReceivable;
}

/*
const optionsDebts = [
  { label: "0001 Carrito $30.00", value: "id" },
  { label: "0002 Cobija $50.00", value: "idd" },
  { label: "0003 Labial $60.00", value: "iddd" },
];


const optionsCustomers = [
  { label: "Eric Villeda", value: "id" },
  { label: "Manuel Angas", value: "idd" },
  { label: "Juan Perez", value: "iddd" },
];
*/

const dataPaymentsDB = [
  {
    id: "00001",
    code_sku: "12234",
    created_at: "01/01/2025",
    amount: 30,
    note: "Proxima semana liquida",
  },
];

export function ModalNewPayment({ account }: Props) {
  const { setModal } = useModal();
  const { t, i18n } = useTranslation();
  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;
  const [dataPayments, setDataPayments] = useState<PaymentsDebt[]>([]);
  const [indebtedCustomers, setIndebtedCustomers] = useState<
    IndebtedCustomer[]
  >([]);
  const [customerDebts, setCustomerDebts] = useState<CustomerDebtsMin[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<
    string | undefined
  >();
  const [selectedDebtId, setSelectedDebtId] = useState<string | undefined>();

  const loadModal = useCallback(async (targetAccount?: AccountsReceivable) => {
    const response = await window.electronAPI.getIndebtedCustomers();
    if (response.success && response.result) {
      setIndebtedCustomers(response.result);
    }

    if (targetAccount) {
      setSelectedCustomerId(targetAccount.idCustomer.toString());
      handleIndebtedCustomer(targetAccount.idCustomer.toString());
      setSelectedDebtId(targetAccount.idSale.toString());
    }
    //const response = await window.electronAPI.getIndebtedCustomers(
    //  targetAccount.idSale,
    //);
  }, []);

  useEffect(() => {
    if (account) {
      loadModal(account);
    } else {
      loadModal();
    }
    //console.log(account);
    setDataPayments(dataPaymentsDB);
  }, [account, loadModal]);

  const optionsCustomers = useMemo(() => {
    return indebtedCustomers.map((c) => ({
      label: `${c.name} ${c.last_name}`,
      value: c.id?.toString(),
    }));
  }, [indebtedCustomers]);

  const optionsDebts = useMemo(() => {
    return customerDebts.map((d) => ({
      label: `${d.customer_debt}`,
      value: d.id?.toString(),
    }));
  }, [customerDebts]);

  const handleIndebtedCustomer = async (value: string) => {
    const response = await window.electronAPI.getCustomerDebts(value);
    if (response.success && response.result) {
      setCustomerDebts(response.result);
    }
  };

  const handleDebtDetail = async (value: string) => {
    console.log(value);
    /*
    const response = await window.electronAPI.getCustomerDebts(value);
    if (response.success && response.result) {
      setCustomerDebts(response.result);
    }*/
  };

  const handlePaymentSuccess = () => {};

  const columnspd = columnsPD(t, i18n.language);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex justify-center items-center z-30 bg-black/10 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="max-w-[700px] h-[500px] lg:h-[700px] flex flex-col p-5 gap-2 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#b3b3b3] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center dark:text-[#b3b3b3]">
          <div className="flex gap-5">
            <PayIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>{t("modalNewPayment.title")}</h2>
              <p className="font-extralight">
                {t("modalNewPayment.description")}
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <p className="dark:text-white">{t("modalNewPayment.subtitle")}</p>
        <div className="w-full flex justify-between items-center gap-2 dark:text-[#b3b3b3]">
          <div className="w-full">
            <p className="font-semibold">{t("modalNewPayment.input1")}</p>
            <CustomSelect
              options={optionsCustomers}
              color="#F57C00"
              placeholder={t("placeholders.select")}
              onChange={handleIndebtedCustomer}
              value={selectedCustomerId}
            />
          </div>
          <div className="w-full">
            <p className="font-semibold">{t("modalNewPayment.input2")}</p>
            <CustomSelect
              options={optionsDebts}
              color="#F57C00"
              placeholder={t("placeholders.select")}
              onChange={handleDebtDetail}
              value={selectedDebtId}
            />
          </div>
        </div>
        <div className="w-full flex justify-between px-2 dark:text-[#b3b3b3]">
          <div className="flex gap-2 font-semibold">
            <p>{t("modalNewPayment.total_debt")}</p>
            <p className="text-[#F57C00]">33</p>
          </div>
          <div className="flex gap-2 font-semibold">
            <p>{t("modalNewPayment.total_payment")}</p>
            <p className="text-[#43A047]">333</p>
          </div>
          <div className="flex gap-2 font-semibold">
            <p>{t("modalNewPayment.total_debt_pending")}</p>
            <p className="text-[#D32F2F]">333</p>
          </div>
        </div>
        <div className="w-full h-[400px] flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 overflow-y-auto dark:text-[#b3b3b3]">
          <NewPaymentForm onSuccess={handlePaymentSuccess} />
          <div>
            <DataTable data={dataPayments} columns={columnspd} />
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
