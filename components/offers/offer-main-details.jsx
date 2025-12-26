"use client";

import React from "react";

import { useI18n } from "../i18n-provider";

const formatDate = (value, locale) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const formatTime = (value) => {
  if (!value) return "-";
  const parts = value.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return value;
};

const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const TagIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41 12 22l-8-8V2h12l4.59 4.59Z" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </svg>
);

const MapIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export default function OfferMainDetails({ offer }) {
  const { t, locale } = useI18n();
  const dateLocale =
    locale === "fr" ? "fr-FR" : locale === "ar" ? "ar-MA" : "en-US";
  const address = [offer?.city?.name, offer?.address].filter(Boolean).join(" - ");
  const dateLabel = formatDate(offer?.start_date, dateLocale);
  const timeLabel = formatTime(offer?.start_time);
  const endDateLabel = formatDate(offer?.end_date, dateLocale);
  const endTimeLabel = formatTime(offer?.end_time);
  const priceLabel = offer?.price
    ? `${offer.price} MAD`
    : t("Budget not specified");
  const showStartTime = timeLabel && timeLabel !== "-";
  const showEndTime = endTimeLabel && endTimeLabel !== "-";

  return (
    <div className="grid gap-2 text-xs text-secondary-500 sm:grid-cols-2">
      <div className="flex items-start gap-2 rounded-2xl bg-[#F7F1FA] px-3 py-2 text-primary-900">
        <CalendarIcon />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary-400">
            {t("Start date")}
          </span>
          <span className="text-xs font-semibold text-primary-900">
            {dateLabel}
          </span>
          {showStartTime ? (
            <span className="text-[11px] text-secondary-500">{timeLabel}</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-2xl bg-[#F7F1FA] px-3 py-2 text-primary-900">
        <ClockIcon />
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary-400">
            {t("End date")}
          </span>
          <span className="text-xs font-semibold text-primary-900">
            {endDateLabel}
          </span>
          {showEndTime ? (
            <span className="text-[11px] text-secondary-500">
              {endTimeLabel}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-[#F7F1FA] px-3 py-2 text-primary-900">
        <TagIcon />
        <span className="font-medium">{priceLabel}</span>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-[#F7F1FA] px-3 py-2 text-primary-900 sm:col-span-2">
        <MapIcon />
        <span className="truncate font-medium">{address || "-"}</span>
      </div>
    </div>
  );

}
