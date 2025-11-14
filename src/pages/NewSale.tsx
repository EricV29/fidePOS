import React from "react";

interface NewSaleProps {}

const NewSale: React.FC<NewSaleProps> = ({}) => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex p-[13px] gap-[15px]">
        <h1>New Sale</h1>
      </div>
    </>
  );
};

export default NewSale;
