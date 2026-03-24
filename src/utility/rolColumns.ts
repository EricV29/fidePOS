export type Role = "admin" | "user";

export function getRolConfig(role: string, t: (key: string) => string) {
  const labelMap: Record<Role, string> = {
    admin: t("global.role_admin"),
    user: t("global.role_user"),
  };

  const colorMap: Record<Role, string> = {
    admin: "rolAdmin",
    user: "rolUser",
  };

  return {
    label: labelMap[role as Role] ?? t("global.rol_uknow"),
    color: colorMap[role as Role] ?? "bg-gray-400",
  };
}
