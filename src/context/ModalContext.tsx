import { createContext, useContext, useState } from "react";
import ModalSuccessAlert from "@modals/ModalSuccessAlert";
import ModalDangerAlert from "@modals/ModalDangerAlert";
import { useTranslation } from "react-i18next";
import AUTH_CODES from "../../constants/authCodes.json";
import ReactDOM from "react-dom";
import ModalWarningAlert from "@modals/ModalWarningAlert";

interface ModalContextType {
  modal: React.ReactNode | null;
  setModal: (content: React.ReactNode | null) => void;
  triggerResponseAlert: (
    code: string | undefined,
    values?: Record<string, string>,
  ) => void;
  triggerWarningAlert: (
    text: string,
    onConfirm: () => Promise<void> | void,
  ) => void;
}

interface AlertModalProps {
  text: string;
  onOk?: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const [alert, setAlert] = useState<React.ReactNode | null>(null);

  const { t } = useTranslation();

  const triggerWarningAlert = (text: string, onConfirm: () => void) => {
    setAlert(
      <ModalWarningAlert
        text={text}
        btnOptions={true}
        onConfirm={async () => {
          setAlert(null);
          await onConfirm();
        }}
        onCancel={() => setAlert(null)}
      />,
    );
  };

  const triggerResponseAlert = (
    code: string | undefined,
    values?: Record<string, string>,
  ) => {
    if (!code) return;

    const alertConfig: Record<
      string,
      {
        Component: React.ComponentType<AlertModalProps>;
        textKey: string;
      }
    > = {
      [AUTH_CODES.USER_NOT_FOUND]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_user_not_found",
      },
      [AUTH_CODES.INCORRECT_PASSWORD]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_incorrect_password",
      },
      [AUTH_CODES.INACTIVE_USER]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_user_inactive",
      },
      [AUTH_CODES.EMAIL_SENT]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_email_send",
      },
      [AUTH_CODES.EMAIL_USED]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_email_used",
      },
      [AUTH_CODES.PHONE_USED]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_phone_used",
      },
      [AUTH_CODES.ADD_USER]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_add_user",
      },
      [AUTH_CODES.UNAUTHORIZED]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_unauthorized",
      },
      [AUTH_CODES.DELETE_USER]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_delete_user",
      },
      [AUTH_CODES.EDIT_USER]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_edit_user",
      },
      [AUTH_CODES.CHANGE_PASS]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_change_pass_user",
      },
      [AUTH_CODES.IMAGE_INVALID]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_img_invalid",
      },
      [AUTH_CODES.IMAGE_LARGE]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_img_large",
      },
      [AUTH_CODES.IMAGE_UPLOAD]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_img_upload",
      },
      [AUTH_CODES.HAS_NOT_INTERNET]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_not_internet",
      },
      [AUTH_CODES.DEBT_NOT_FOUND]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_debt_not_found",
      },
      [AUTH_CODES.DEBT_PAYMENT_SUCCESS]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_debt_payment_success",
      },
      [AUTH_CODES.ADD_CUSTOMER]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_add_customer",
      },
      [AUTH_CODES.INSUFFICIENT_AMOUNT]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_insufficient_amount",
      },
      [AUTH_CODES.NOT_CREDIT_SALE]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_not_credit_sale",
      },
      [AUTH_CODES.INSUFFICIENT_STOCK]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_insufficient_stock",
      },
      [AUTH_CODES.CREATE_NEW_SALE]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_create_new_sale",
      },
      [AUTH_CODES.NOT_CUSTOMER_SELECT]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_not_customer_select",
      },
      [AUTH_CODES.CATEGORY_USED]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_category_used",
      },
      [AUTH_CODES.ADD_CATEGORY]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_add_category",
      },
      [AUTH_CODES.PRODUCT_INACTIVE]: {
        Component: ModalDangerAlert,
        textKey: "modalDangerAlert.text_product_inactive",
      },
      [AUTH_CODES.DELETE_PRODUCT]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_delete_product",
      },
    };

    const config = alertConfig[code];

    if (config) {
      setAlert(
        <config.Component
          text={t(config.textKey, values)}
          onOk={() => setAlert(null)}
        />,
      );
    } else {
      console.warn(`Response code not recognized: ${code}`);
    }
  };

  return (
    <ModalContext.Provider
      value={{ modal, setModal, triggerResponseAlert, triggerWarningAlert }}
    >
      {children}
      {alert &&
        ReactDOM.createPortal(alert, document.getElementById("alert-root")!)}
      {modal &&
        ReactDOM.createPortal(modal, document.getElementById("modal-root")!)}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal debe usarse dentro de <ModalProvider>");
  return ctx;
}
