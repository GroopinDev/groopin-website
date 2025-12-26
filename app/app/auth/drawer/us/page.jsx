"use client";

import React, { useMemo } from "react";

import { useI18n } from "../../../../../components/i18n-provider";
import { getTranslationValue } from "../../../../lib/i18n";

export default function UsPage() {
  const { t, locale } = useI18n();
  const about = useMemo(() => {
    const value = getTranslationValue(locale, "about");
    if (!value || typeof value !== "object") return null;
    return value;
  }, [locale]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary-800">
        {about?.title || t("Us")}
      </h1>
      {about?.paragraph1 ? (
        <p className="text-sm text-secondary-500">{about.paragraph1}</p>
      ) : null}
      {about?.paragraph2 ? (
        <p className="text-sm text-secondary-500">{about.paragraph2}</p>
      ) : null}

      {about?.missionTitle ? (
        <div className="rounded-2xl border border-[#EADAF1] bg-white p-4">
          <p className="text-sm font-semibold text-primary-900">
            {about.missionTitle}
          </p>
          <p className="mt-2 text-sm text-secondary-500">
            {about.missionText}
          </p>
        </div>
      ) : null}

      {about?.goalTitle ? (
        <div className="rounded-2xl border border-[#EADAF1] bg-white p-4">
          <p className="text-sm font-semibold text-primary-900">
            {about.goalTitle}
          </p>
          <p className="mt-2 text-sm text-secondary-500">{about.goalText}</p>
        </div>
      ) : null}
    </div>
  );
}
