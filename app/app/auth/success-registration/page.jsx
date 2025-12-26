"use client";

import React from "react";
import { useRouter } from "next/navigation";

import Button from "../../../../components/ui/button";
import { useI18n } from "../../../../components/i18n-provider";

export default function SuccessRegistrationPage() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center px-4 pb-10">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-3 mt-8 text-3xl font-bold text-primary-800">
          {t("auth.registration_success_title")}
        </h1>
        <p className="mb-8 text-secondary-400">
          {t("auth.registration_success_description")}
        </p>

        <div className="space-y-4">
          <Button
            label={t("profile.complete_profile")}
            size="lg"
            className="w-full"
            onClick={() => router.replace("/app/auth/drawer/tabs/profile")}
          />
          <Button
            variant="link"
            label={t("auth.skip_this_step")}
            onClick={() => router.replace("/app/auth/drawer/tabs")}
          />
        </div>
      </div>
    </div>
  );
}
