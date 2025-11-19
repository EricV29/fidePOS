import React from "react";

interface IconProps {
  size?: number;
  color?: string;
}

const LeftIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
}) => (
  <svg width={size} color={color} viewBox="0 0 24 24" fill="none">
    <path
      d="M15.5831 4L8.9964 10.5866C8.62508 10.9633 8.41693 11.471 8.41693 12C8.41693 12.529 8.62508 13.0367 8.9964 13.4134L15.5831 20"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default LeftIcon;
