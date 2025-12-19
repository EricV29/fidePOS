export type Rol = "admin" | "user";

export function getRolConfig(rol: string, t: (key: string) => string) {
  const labelMap: Record<Rol, string> = {
    admin: t("global.rol_admin"),
    user: t("global.rol_user"),
  };

  const colorMap: Record<Rol, string> = {
    admin: "rolAdmin",
    user: "rolUser",
  };

  return {
    label: labelMap[rol as Rol] ?? t("global.rol_uknow"),
    color: colorMap[rol as Rol] ?? "bg-gray-400",
  };
}
