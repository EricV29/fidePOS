export type Status = "active" | "inactive" | "paid" | "unpaid" | "debt";

export function getStatusConfig(status: string, t: (key: string) => string) {
  const labelMap: Record<Status, string> = {
    active: t("global.status_active"),
    inactive: t("global.status_inactive"),
    paid: t("global.status_paid"),
    unpaid: t("global.status_unpaid"),
    debt: t("global.status_debt"),
  };

  const colorMap: Record<Status, string> = {
    active: "statusActiveB",
    paid: "statusActiveB",

    inactive: "statusInactiveB",
    unpaid: "statusInactiveB",

    debt: "statusDebtB",
  };

  return {
    label: labelMap[status as Status] ?? t("global.status_unknown"),
    color: colorMap[status as Status] ?? "bg-gray-400",
  };
}
