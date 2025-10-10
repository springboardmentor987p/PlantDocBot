import React from "react";

// Card container
export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 ${className}`}
    >
      {children}
    </div>
  );
};

// Card header wrapper
export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-3 ${className}`}>
      {children}
    </div>
  );
};

// Card title
export const CardTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

// Card description
export const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-gray-600 text-sm ${className}`}>
      {children}
    </p>
  );
};

// Card content wrapper
export const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  );
};
