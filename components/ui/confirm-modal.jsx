"use client";

import React from "react";

import Button from "./button";
import Modal from "./modal";
import { useI18n } from "../i18n-provider";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = "default",
  loading = false,
  disabled = false,
  error = "",
  onConfirm,
  onClose
}) {
  const { t } = useI18n();

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {description ? (
        <div className="text-sm text-secondary-500 whitespace-pre-line">
          {description}
        </div>
      ) : null}
      {error ? (
        <p className="mt-3 text-xs text-danger-600">{error}</p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          label={cancelLabel || t("Cancel")}
          className="w-full"
          onClick={onClose}
          disabled={loading}
        />
        <Button
          variant={confirmVariant}
          label={confirmLabel || t("Confirm")}
          className="w-full"
          onClick={onConfirm}
          loading={loading}
          disabled={disabled}
        />
      </div>
    </Modal>
  );
}
