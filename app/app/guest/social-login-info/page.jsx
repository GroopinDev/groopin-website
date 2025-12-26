"use client";

import React from "react";

import { useI18n } from "../../../../components/i18n-provider";

export default function SocialLoginInfoPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col justify-center px-1 pb-10 pt-6">
      <h1 className="mb-3 mt-6 text-3xl font-bold text-primary-800">
        {t("profile.complete_profile")}
      </h1>
      <p className="mb-6 text-secondary-400">
        {t("profile.complete_profile_question")}
      </p>
    </div>
  );
}
