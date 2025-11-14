import React from "react";

interface ProductsProps {}

const Products: React.FC<ProductsProps> = ({}) => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex p-[13px] gap-[15px]">
        <h1>Products</h1>
      </div>
    </>
  );
};

export default Products;
