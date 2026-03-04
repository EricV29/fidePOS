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
import type { generalDebtData } from "@typesm/debts";
import { columnsPD } from "@columns/columnsPD";
import { useTranslation } from "react-i18next";
import { currencyFormat } from "@utility/currencyFormat";
import { useLoading } from "@context/LoadingContext";
import { type NewPaymentFormValues } from "@forms/schemas/payment.schema";
interface Props {
  account?: AccountsReceivable;
  onSuccess: () => void;
}

export function ModalNewPayment({ account, onSuccess }: Props) {
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
  const [generalData, setGeneralData] = useState<generalDebtData | undefined>();
  const { setLoading } = useLoading();
  const { triggerWarningAlert, triggerResponseAlert } = useModal();

  //* Get Customer Debts
  const handleCustomerDebts = useCallback(async (value: string) => {
    const response = await window.electronAPI.getCustomerDebts(value);

    if (response.success && response.result) {
      setCustomerDebts(response.result);
    }
  }, []);

  //* Get Debt Details
  const handleDebtDetail = useCallback(
    async (value: string) => {
      setSelectedDebtId(value);
      const response = await window.electronAPI.getDebtDetail(value);
      const debtDetailData =
        typeof response.result === "string"
          ? JSON.parse(response.result)
          : response.result;

      if (debtDetailData?.detailDebt) {
        const generalData = debtDetailData.detailDebt.result;
        setGeneralData(generalData[0]);
      }

      if (debtDetailData?.paymentsDebt) {
        const paymentsDebt = debtDetailData.paymentsDebt.result;
        setDataPayments(paymentsDebt);
        setLoading(false);
      }
    },
    [setLoading],
  );

  const loadModal = useCallback(
    async (targetAccount?: AccountsReceivable) => {
      //* Get indebted customers
      const response = await window.electronAPI.getIndebtedCustomers();
      if (response.success && response.result) {
        setIndebtedCustomers(response.result);
      }

      if (targetAccount) {
        setLoading(true);
        setSelectedCustomerId(targetAccount.idCustomer.toString());
        handleCustomerDebts(targetAccount.idCustomer.toString());
        setSelectedDebtId(targetAccount.idSale.toString());
        handleDebtDetail(targetAccount.idSale.toString());
      }
    },
    [handleCustomerDebts, handleDebtDetail, setLoading],
  );

  useEffect(() => {
    if (account) {
      loadModal(account);
    } else {
      loadModal();
    }
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

  const handlePaymentSuccess = async (values: NewPaymentFormValues) => {
    triggerWarningAlert(t("modalWarningAlert.text_debt_payment"), async () => {
      try {
        setLoading(true);
        //* Add payment debt
        const data = {
          note: values.note,
          payment_amount: parseFloat(values.payment_amount),
          idSale: Number(selectedDebtId),
        };
        const response = await window.electronAPI.addPaymentDebt(data);
        if (response.success && response.result) {
          onSuccess();
          handleDebtDetail(selectedDebtId!);
          setLoading(false);
          triggerResponseAlert(response.result);
        } else {
          triggerResponseAlert(response.error);
        }
      } catch (err) {
        console.error("Comunication Error:", err);
      } finally {
        setLoading(false);
      }
    });
  };

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
              onChange={handleCustomerDebts}
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
            <p className="text-[#F57C00]">
              {generalData
                ? currencyFormat(generalData.debt_amount)
                : t("global.loading")}
            </p>
          </div>
          <div className="flex gap-2 font-semibold">
            <p>{t("modalNewPayment.total_payment")}</p>
            <p className="text-[#43A047]">
              {generalData
                ? currencyFormat(generalData.debt_paid)
                : t("global.loading")}
            </p>
          </div>
          <div className="flex gap-2 font-semibold">
            <p>{t("modalNewPayment.total_debt_pending")}</p>
            <p className="text-[#D32F2F]">
              {generalData
                ? currencyFormat(generalData.debt_pending)
                : t("global.loading")}
            </p>
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
