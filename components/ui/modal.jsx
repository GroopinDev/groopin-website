"use client";

import React, { useEffect } from "react";

import { useI18n } from "../i18n-provider";

export default function Modal({
  open,
  title,
  onClose,
  closeLabel,
  children
}) {
  const { t } = useI18n();
  const resolvedCloseLabel = closeLabel || t("Close");

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      onClick={() => onClose?.()}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-primary-900">
            {title || "Dialog"}
          </h2>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="text-sm font-semibold text-secondary-400"
          >
            {resolvedCloseLabel}
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
