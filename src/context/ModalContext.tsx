import { createContext, useContext, useState } from "react";

interface ModalContextType {
  modal: React.ReactNode | null;
  setModal: (content: React.ReactNode | null) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<React.ReactNode | null>(null);

  return (
    <ModalContext.Provider value={{ modal, setModal }}>
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
