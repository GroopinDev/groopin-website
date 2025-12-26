"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "../../components/i18n-provider";
import { getToken } from "../lib/session";

export default function AppEntry() {
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    const token = getToken();
    router.replace(token ? "/app/auth/drawer/tabs" : "/app/guest/login");
  }, [router]);

  return (
    <div className="rounded-3xl border border-neutral-100 bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
        Groopin web
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-primary-800">
        {t("Processing login")}
      </h1>
      <p className="mt-3 text-neutral-500">{t("Loading more...")}</p>
    </div>
  );
}
