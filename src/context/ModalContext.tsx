import { createContext, useContext, useState } from "react";
import ModalSuccessAlert from "@modals/ModalSuccessAlert";
import ModalWarningAlert from "@modals/ModalWarningAlert";
import ModalDangerAlert from "@modals/ModalDangerAlert";
import { useTranslation } from "react-i18next";
import AUTH_CODES from "../../constants/authCodes.json";

interface ModalContextType {
  modal: React.ReactNode | null;
  setModal: (content: React.ReactNode | null) => void;
  triggerResponseAlert: (code: string | undefined) => void;
}

interface AlertModalProps {
  text: string;
  btnOptions: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<React.ReactNode | null>(null);
  const { t } = useTranslation();

  const triggerResponseAlert = (code: string | undefined) => {
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
        Component: ModalWarningAlert,
        textKey: "modalDangerAlert.text_user_inactive",
      },
      [AUTH_CODES.EMAIL_SENT]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_email_send",
      },
      [AUTH_CODES.USER_ADDED]: {
        Component: ModalSuccessAlert,
        textKey: "modalSuccessAlert.text_user_added",
      },
    };

    const config = alertConfig[code];

    if (config) {
      setModal(
        <config.Component text={t(config.textKey)} btnOptions={false} />,
      );
    } else {
      console.warn(`Código de respuesta no reconocido: ${code}`);
    }
  };

  return (
    <ModalContext.Provider value={{ modal, setModal, triggerResponseAlert }}>
      {children}
      {modal}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal debe usarse dentro de <ModalProvider>");
  return ctx;
}
