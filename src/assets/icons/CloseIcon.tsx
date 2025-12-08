import React from "react";

interface IconProps {
  size?: number;
  color?: string;
}

const CloseIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg width={size} color={color} viewBox="0 0 24 24" fill="none">
    <path
      d="M19 5L5 19"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19 19L5 5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default CloseIcon;
