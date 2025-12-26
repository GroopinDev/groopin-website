"use client";

import React from "react";

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-5 font-semibold transition disabled:cursor-not-allowed";

const sizeStyles = {
  default: "h-10 text-base",
  lg: "h-12 text-lg",
  sm: "h-9 text-sm"
};

const variantStyles = {
  default:
    "bg-gradient-to-r from-primary-500 via-[#822485] to-secondary-500 text-white",
  secondary: "bg-secondary-600 text-white",
  outline: "border border-neutral-400 text-primary-500",
  link: "bg-transparent text-primary-500 underline underline-offset-4",
  ghost: "bg-transparent text-black underline",
  destructive: "bg-danger-600 text-white"
};

export default function Button({
  label,
  children,
  variant = "default",
  size = "default",
  className = "",
  textClassName = "",
  disabled = false,
  loading = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-white" />
      ) : (
        <span className={textClassName}>{label || children}</span>
      )}
    </button>
  );
}
