import { useState, useEffect, useCallback } from "react";
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

interface paidVSPending {
  [key: string]: number;
}

export default function History() {
  const { t, i18n } = useTranslation();
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
  const [discountsAmountCard, setDiscountsAmountCard] = useState(0);
  const [paidVSPendingNumberCard, setPaidVSPendingNumberCard] =
    useState<paidVSPending>();
  const [historySales, setHistorySales] = useState<Sales[]>([]);

  const loadHistory = useCallback(async () => {
    const limit = pagination.pageSize;
    const offset = pagination.pageIndex * pagination.pageSize;
    const response = await window.electronAPI.getHistoryData({
      limit: limit,
      offset: offset,
    });
    const historyData =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (historyData.salesNumber) {
      const salesNumber = historyData.salesNumber.result;
      setSalesCardNumber(salesNumber[0].salesNumber);
    }

    if (historyData.pendingSalesAmount) {
      const pendingSalesAmount = historyData.pendingSalesAmount.result;
      setPendingSalesCardAmount(pendingSalesAmount[0].pendingSalesAmount);
    }

    if (historyData.discountsAmount) {
      const discountsAmount = historyData.discountsAmount.result;
      setDiscountsAmountCard(discountsAmount[0].discountsAmount);
    }

    if (historyData.paidVSPendingNumber) {
      const paidVSPendingNumber = historyData.paidVSPendingNumber.result;
      setPaidVSPendingNumberCard(paidVSPendingNumber[0]);
    }

    if (historyData?.historySales) {
      const historySalesData = historyData.historySales.result;
      setHistorySales(historySalesData);
      setTotalRows(historyData.historySales.totalCount);
    }
  }, [pagination]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

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
              number={discountsAmountCard}
              format={true}
              color="#F57C00"
            />
            <CardInfoDetail
              chartData={paidVSPendingNumberCard!}
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
              data={historySales}
              columns={columnss}
              page={"history"}
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
