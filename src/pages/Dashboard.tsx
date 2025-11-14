import React from "react";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = ({}) => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex p-[13px] gap-[15px]">
        <h1>Dashboard</h1>
      </div>
    </>
  );
};

export default Dashboard;
