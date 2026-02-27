import { useState, useEffect } from "react";
import ExportIcon from "@icons/ExportIcon";
import InvestmentIcon from "@icons/InvestmentIcon";
import CardInfoNumber from "@components/CardInfoNumber";
import CardInfoDetail from "@components/CardInfoDetail";
import { DataTableSearch } from "@components/data-table-search";
import { columnsS } from "@columns/columnsS";
import type { Sales } from "@typesm/sales";
import { useModal } from "@context/ModalContext";
import { ModalExport } from "@modals/ModalExport";
import { useTranslation } from "react-i18next";
import FlagIcon from "@icons/FlagIcon";
import { ModalSales } from "@modals/ModalSales";

interface dataSalesVSI {
  [key: string]: number;
}

//* Example data pending vs paid sales
const dataSalesVSDB = { Paid: 100, Pending: 40 };

//* Example data products
const dataSalesDB = [
  {
    id: "34234",
    name: "Eric",
    last_name: "Villeda",
    num_sale: "0001",
    products:
      "Labial, carrito, estuche, peluche, edredon, manguito, peine, cepillo, bolsa, moño",
    total_amount: 1000,
    paid_amount: 1000,
    pending_amount: 0,
    status: "paid",
    created_at: "2025-11-16 00:00:00",
  },
];

export default function History() {
  const { t, i18n } = useTranslation();
  const [dataSalesVS, setSalesVS] = useState<dataSalesVSI>();
  const [dataSale, setSale] = useState<Sales[]>([]);
  const { setModal, triggerQuestionAlert } = useModal();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const optionsExportPage = [
    {
      id: "current",
      label: t("modalQuestionAlert.current_view"),
      description: t("modalQuestionAlert.text_current_view"),
    },
    {
      id: "total",
      label: t("modalQuestionAlert.total_data"),
      description: t("modalQuestionAlert.text_total_data"),
    },
  ];
  const [salesCardNumber, setSalesCardNumber] = useState(0);
  const [pendingSalesCardAmount, setPendingSalesCardAmount] = useState(0);

  const loadHistory = async () => {
    const response = await window.electronAPI.getHistoryData();
    const historyData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    console.log(historyData);

    if (historyData.salesNumber) {
      const salesNumber = historyData.salesNumber.result;
      setSalesCardNumber(salesNumber[0].salesNumber);
    }

    if (historyData.pendingSalesAmount) {
      const pendingSalesAmount = historyData.pendingSalesAmount.result;
      setPendingSalesCardAmount(pendingSalesAmount[0].pendingSalesAmount);
    }
  };

  useEffect(() => {
    loadHistory();
    setSalesVS(dataSalesVSDB);
    setSale(dataSalesDB);
  }, []);

  const columnss = columnsS(t, i18n.language);

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}>
            {t("history.title")}
          </h1>
          <div className="flex gap-2">MODAL EXPORT</div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <div className="flex-1 min-h-0 w-full flex flex-col gap-2">
          <div className="w-full h-[120px] flex justify-between gap-2 overflow-x-auto overflow-y-hidden">
            <CardInfoNumber
              icon={null}
              title={t("cards.sales_title")}
              icond={FlagIcon}
              number={salesCardNumber}
              format={false}
              color="#43A047"
            />
            <CardInfoNumber
              icon={InvestmentIcon}
              title={t("cards.pending_title")}
              icond={null}
              number={pendingSalesCardAmount}
              format={true}
              color="#D32F2F"
            />
            <CardInfoNumber
              icon={InvestmentIcon}
              title={t("cards.discounts_title")}
              icond={null}
              number={1000}
              format={true}
              color="#F57C00"
            />
            <CardInfoDetail
              chartData={dataSalesVS!}
              title={t("cards.salesvs_title")}
              color="#1976D2"
            />
          </div>
          <div className="w-full min-h-0 flex flex-col flex-1 p-4 gap-4 border-2 border-[#b3b3b3] rounded-[10px] bg-transparent">
            <p className="font-semibold dark:text-white">
              {" "}
              {t("history.table1")}
            </p>
            <DataTableSearch
              data={dataSale}
              columns={columnss}
              pagination={pagination}
              setPagination={setPagination}
              totalRows={totalRows}
              actions={{
                onView: (row) => {
                  setModal(<ModalSales idSale={Number(row.id)} />);
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
