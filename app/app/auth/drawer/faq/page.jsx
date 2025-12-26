"use client";

import React, { useMemo } from "react";

import { useI18n } from "../../../../../components/i18n-provider";
import { getTranslationValue } from "../../../../lib/i18n";

const sortFaq = (entries) =>
  entries.sort((a, b) => {
    const left = Number(String(a[0]).replace(/\D/g, "")) || 0;
    const right = Number(String(b[0]).replace(/\D/g, "")) || 0;
    return left - right;
  });

export default function FaqPage() {
  const { t, locale } = useI18n();
  const faqEntries = useMemo(() => {
    const faq = getTranslationValue(locale, "faq");
    if (!faq || typeof faq !== "object") return [];
    return sortFaq(Object.entries(faq));
  }, [locale]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary-800">{t("FAQ")}</h1>
      {faqEntries.length === 0 ? (
        <p className="text-sm text-secondary-400">{t("nothingToShow")}</p>
      ) : (
        <div className="space-y-5">
          {faqEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl border border-[#EADAF1] bg-white p-4"
            >
              <p className="text-sm font-semibold text-primary-900">
                {value?.question || t("Details")}
              </p>
              <p className="mt-2 text-sm text-secondary-500">
                {value?.answer || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
