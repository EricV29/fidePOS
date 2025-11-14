import React from "react";

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = ({}) => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex p-[13px] gap-[15px]">
        <h1>Setting</h1>
      </div>
    </>
  );
};

export default Settings;
