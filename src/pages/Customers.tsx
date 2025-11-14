import React from "react";

interface CustomersProps {}

const Customers: React.FC<CustomersProps> = ({}) => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex p-[13px] gap-[15px]">
        <h1>Customers</h1>
      </div>
    </>
  );
};

export default Customers;
