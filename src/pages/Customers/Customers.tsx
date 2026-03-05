import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExportIcon from "@icons/ExportIcon";
import UserPlusIcon from "@icons/UserPlusIcon";
import PayIcon from "@icons/PayIcon";
import Switch from "@components/Switch";
import { Outlet } from "react-router-dom";
import { useModal } from "@context/ModalContext";
import { ModalAddCustomer } from "@components/modals/ModalAddCustomer";
import { ModalExport } from "@modals/ModalExport";
import { ModalNewPayment } from "@modals/ModalNewPayment";
import { useTranslation } from "react-i18next";
import type { dataExportCustomers } from "@typesm/customers";

interface CustomersProps {}

interface ExportableChild {
  createReport: (selectedId: string) => Promise<dataExportCustomers[][]>;
}

const Customers: React.FC<CustomersProps> = ({}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const optionsCustomers = [
    { label: "General", value: "general" },
    { label: t("customers.switch_option2"), value: "payments" },
  ];
  const currentSegment = location.pathname.split("/").pop();
  const currentTab =
    optionsCustomers.find((op) => op.value === currentSegment)?.value ||
    optionsCustomers[0].value;
  const { setModal, triggerQuestionAlert, triggerResponseAlert } = useModal();

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

  const childRef = useRef<ExportableChild>(null);

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1>{t("customers.title")}</h1>
          <div className="flex gap-2">
            <button
              className="bnormal"
              onClick={() => {
                triggerQuestionAlert(
                  t("modalQuestionAlert.export_page"),
                  optionsExportPage,
                  async (selectedId) => {
                    const id = String(selectedId);
                    if (childRef.current) {
                      const dataExport =
                        await childRef.current.createReport(id);

                      if (dataExport.length > 0) {
                        setModal(
                          <ModalExport
                            page="CUSTOMER_GENERAL"
                            data={dataExport}
                          />,
                        );
                      } else {
                        triggerResponseAlert("NOT_SELECTED_CUSTOMER");
                      }
                    }
                  },
                );
              }}
            >
              <ExportIcon /> <p>{t("buttons.btn_export")}</p>
            </button>
            <button
              className="bnormal"
              onClick={() =>
                setModal(<ModalAddCustomer onSuccess={() => {}} />)
              }
            >
              <UserPlusIcon /> <p>{t("buttons.btn_add_customer")}</p>
            </button>
            <button
              className="bnormal"
              onClick={() => setModal(<ModalNewPayment onSuccess={() => {}} />)}
            >
              <PayIcon /> <p>{t("buttons.btn_add_payment")}</p>
            </button>
          </div>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
        <Switch
          options={optionsCustomers}
          active={currentTab}
          onChange={(value) => navigate(`./${value}`)}
        />
        <div className="flex-1 w-full h-full min-h-0 pt-3">
          <Outlet context={childRef} />
        </div>
      </div>
    </>
  );
};

export default Customers;
