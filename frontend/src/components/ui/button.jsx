import React from "react";

export const Button = ({ children, onClick, className = "", type = "type", disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={` transition-all ${className}`}
    >
      {children}
    </button>
  );
};
