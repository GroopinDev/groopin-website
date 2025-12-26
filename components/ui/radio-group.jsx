"use client";

import React from "react";

export default function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            className="h-4 w-4 text-primary-500 focus:ring-primary-400"
          />
          <span className="text-neutral-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
