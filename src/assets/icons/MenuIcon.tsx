import React from "react";
import type { IconProps } from "@typesm/icons";

const MenuIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => (
  <svg
    width={size}
    color={color}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M4.5 12H19.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
    <path
      d="M4.5 17.7692H19.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
    <path
      d="M4.5 6.23077H19.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
    />
  </svg>
);

export default MenuIcon;
