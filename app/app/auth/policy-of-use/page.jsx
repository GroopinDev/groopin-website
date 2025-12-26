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

export default function PolicyOfUsePage() {
  const { t, locale } = useI18n();
  const community = useMemo(() => {
    const value = getTranslationValue(locale, "community");
    if (!value || typeof value !== "object") return null;
    return value;
  }, [locale]);

  const sections = useMemo(() => {
    if (!community) return [];
    const entries = Object.entries(community).filter(([key, value]) => {
      return key.startsWith("section") && value && typeof value === "object";
    });
    return sortSections(entries);
  }, [community]);

  return (
    <div className="px-1 pb-10 pt-6">
      <h1 className="mb-2 text-2xl font-semibold text-black">
        {community?.title || t("policy of use")}
      </h1>
      {community?.subtitle ? (
        <p className="mb-4 text-sm text-secondary-500">{community.subtitle}</p>
      ) : null}
      {community?.note ? (
        <p className="mb-6 text-sm text-secondary-400">{community.note}</p>
      ) : null}

      {sections.length === 0 ? (
        <p className="text-sm text-secondary-400">{t("nothingToShow")}</p>
      ) : (
        <div className="space-y-5">
          {sections.map(([key, section]) => (
            <div
              key={key}
              className="rounded-2xl border border-[#EADAF1] bg-white p-4"
            >
              <p className="text-sm font-semibold text-primary-900">
                {section?.title || t("Details")}
              </p>
              <div className="mt-2 space-y-2 text-sm text-secondary-500">
                {Object.entries(section || {})
                  .filter(([itemKey]) => itemKey.startsWith("point"))
                  .map(([itemKey, value]) => (
                    <p key={itemKey}>{value}</p>
                  ))}
                {section?.content ? <p>{section.content}</p> : null}
                {section?.closing ? <p>{section.closing}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
