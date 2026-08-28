import React from "react";

const VARIANTS = { primary: "btn-primary", secondary: "btn-secondary", ghost: "btn-ghost" };

export function Button({ children, variant = "secondary", block = false, className = "", ...props }) {
  return (
    <button {...props} className={`btn ${VARIANTS[variant] || VARIANTS.secondary} ${block ? "btn-block" : ""} ${className}`}>
      {children}
    </button>
  );
}
