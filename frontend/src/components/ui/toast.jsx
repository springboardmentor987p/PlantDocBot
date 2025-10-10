import React from "react";

export const ToastProvider = ({ children }) => {
  return <div className="fixed top-5 right-5 z-50">{children}</div>;
};

export const Toast = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-lg rounded-md p-4 mb-3 border border-gray-200 flex justify-between items-start ${className}`}
    >
      {children}
    </div>
  );
};

export const ToastTitle = ({ children }) => (
  <div className="font-semibold text-gray-900">{children}</div>
);

export const ToastDescription = ({ children }) => (
  <div className="text-gray-600 text-sm">{children}</div>
);

export const ToastClose = ({ onClick }) => (
  <button
    onClick={onClick}
    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
  >
    ✕
  </button>
);

export const ToastViewport = () => <div className="pointer-events-none" />;
