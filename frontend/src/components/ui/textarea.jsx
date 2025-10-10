import React from "react";

export const Textarea = ({
  value,
  onChange,
  placeholder = "",
  id,
  name,
  rows = 4,
  className = "",
  required = false,
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none ${className}`}
    />
  );
};
