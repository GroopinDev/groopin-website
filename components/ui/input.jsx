"use client";

import React, { useState } from "react";

export default function Input({
  label,
  error,
  type = "text",
  className = "",
  inputClassName = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "border-danger-600"
    : focused
      ? "border-primary-500"
      : "border-[#EADAF1]";

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <label className="mb-1 block text-lg text-primary-500">{label}</label>
      ) : null}
      <div className={`rounded-full border-2 px-4 py-3 ${borderColor}`}>
        <input
          type={type}
          className={`w-full bg-transparent text-secondary-400 outline-none placeholder:text-neutral-400 ${inputClassName}`}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-2 text-sm text-danger-600">{error}</p>
      ) : null}
    </div>
  );
}
