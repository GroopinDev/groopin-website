"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

import AnimatedLogo from "./ui/animated-logo";
import { useI18n } from "./i18n-provider";

export default function AuthHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const showBack = pathname?.includes("/terms-and-conditions");

  return (
    <header className="flex h-16 items-center px-4">
      <div className="w-16">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-primary-900"
          >
            {t("Close")}
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 justify-center">
        <AnimatedLogo width={90} height={40} />
      </div>
      <div className="w-16" />
    </header>
  );
}
