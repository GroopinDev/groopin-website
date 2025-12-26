"use client";

import React, { useMemo } from "react";

import { useI18n } from "../../../../components/i18n-provider";
import { getTranslationValue } from "../../../lib/i18n";

const sortSections = (entries) =>
  entries.sort((a, b) => {
    const left = Number(String(a[0]).replace(/\D/g, "")) || 0;
    const right = Number(String(b[0]).replace(/\D/g, "")) || 0;
    return left - right;
  });

export default function TermsAndConditionsPage() {
  const { t, locale } = useI18n();
  const sections = useMemo(() => {
    const value = getTranslationValue(locale, "cgu.sections");
    if (!value || typeof value !== "object") return [];
    return sortSections(Object.entries(value));
  }, [locale]);

  return (
    <div className="px-1 pb-10 pt-6">
      <h1 className="mb-6 text-2xl font-semibold text-black">
        {t("cgu.title")}
      </h1>

      {sections.length === 0 ? (
        <p className="text-sm text-secondary-400">{t("nothingToShow")}</p>
      ) : (
        sections.map(([key, section], index) => (
          <section key={key} className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              {index + 1}. {section?.title || t("Details")}
            </h2>
            <p className="whitespace-pre-line text-base text-gray-700">
              {section?.content || "-"}
            </p>
          </section>
        ))
      )}
    </div>
  );
}
