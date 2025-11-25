import { useOutletContext } from "react-router-dom";

export type ContextType = { installDate: string };

export function useInstallDate() {
  return useOutletContext<ContextType>();
}
