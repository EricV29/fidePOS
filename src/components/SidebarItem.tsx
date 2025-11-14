import React from "react";

interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  isOpen: boolean;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isOpen,
  active,
  onClick,
}) => {
  return (
    <button
      className={`sideitem flex items-center gap-10 w-full px-4 py-2 rounded-lg transition-colors ${
        active ? "active bg-[#F57C00] text-[#ffffff]" : "text-[#5d5d5d]"
      }`}
      onClick={onClick}
    >
      <Icon size={30} />
      {isOpen && <span>{label}</span>}
    </button>
  );
};

export default SidebarItem;
