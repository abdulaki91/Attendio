import React from "react";

const Button = ({ children, onClick, disabled = false, className }) => {
  return (
    <button
      className={` p-2 sm:px-2 md:px-3 w-max lg:px-4 sm:text-sm lg:text-base text-xs border-primary border rounded-md inline-flex items-center justify-center  text-center font-medium hover:bg-[#1B44C8] hover:border-[#1B44C8] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#1B44C8] active:border-[#1B44C8] ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
