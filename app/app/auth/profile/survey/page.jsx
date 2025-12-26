"use client";

import React from "react";

import { useI18n } from "../../../../../components/i18n-provider";

export default function ProfileSurveyPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-primary-800">
        {t("profile.survey")}
      </h1>
      <p className="text-sm text-secondary-400">{t("nothingToShow")}</p>
    </div>
  );
}
