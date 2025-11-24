import React from "react";

interface ProductsProps {}

const Products: React.FC<ProductsProps> = ({}) => {
  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0">
        <div className="w-full h-fit flex justify-between items-end">
          <h1 className="text-[30px] mb-0">Product Inventory</h1>
          Boton o date picker
        </div>
        <hr className="border border-[#b3b3b3] my-2" />
      </div>
    </>
  );
};

export default Products;
