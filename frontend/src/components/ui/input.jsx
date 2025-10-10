import React from "react";

export const Input = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  id,
  name,
  className = "",
  required = false,
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${className}`}
    />
  );
};
