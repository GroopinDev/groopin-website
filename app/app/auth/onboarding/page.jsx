"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../../../../components/ui/button";
import { useI18n } from "../../../../components/i18n-provider";
import { apiRequest } from "../../../lib/api-client";

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useI18n();
  const scrollRef = useRef(null);
  const [screens, setScreens] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    apiRequest("parameters")
      .then((payload) => {
        if (!isMounted) return;
        const items = payload?.onboarding_screens || [];
        setScreens(Array.isArray(items) ? items : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (event) => {
    const container = event.currentTarget;
    const width = container.clientWidth || 1;
    const nextIndex = Math.round(container.scrollLeft / width);
    setActiveIndex(nextIndex);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">
            {t("Onboarding")}
          </h1>
        </div>
        <Button variant="link" label={t("Close")} onClick={() => router.back()} />
      </div>

      {status === "loading" ? (
        <div className="space-y-3">
          <div className="h-64 animate-pulse rounded-3xl bg-neutral-100" />
          <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-100" />
        </div>
      ) : null}

      {status === "error" ? (
        <p className="text-sm text-danger-600">
          {t("general.error_has_occurred")}
        </p>
      ) : null}

      {status === "ready" && screens.length === 0 ? (
        <p className="text-sm text-secondary-400">
          {t("nothingToShow")}
        </p>
      ) : null}

      {status === "ready" && screens.length > 0 ? (
        <div className="rounded-[32px] bg-gradient-to-r from-primary-700 to-secondary-600 p-4 text-white">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4"
          >
            {screens.map((screen, index) => (
              <div
                key={`${screen.id || "screen"}-${index}`}
                className="w-full shrink-0 snap-center px-3"
              >
                <div className="flex h-full flex-col items-center gap-4 rounded-3xl bg-white px-6 py-8 text-center text-primary-900">
                  {screen.image_url ? (
                    <img
                      src={screen.image_url}
                      alt={screen.title || "Onboarding slide"}
                      className="h-40 w-full max-w-sm rounded-2xl object-contain"
                    />
                  ) : (
                    <div className="h-40 w-full max-w-sm rounded-2xl bg-neutral-100" />
                  )}
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-primary-800">
                      {screen.title || t("welcome")}
                    </h2>
                    {screen.description ? (
                      <p className="text-sm text-secondary-500">
                        {screen.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            {screens.map((_, index) => (
              <span
                key={`dot-${index}`}
                className={`h-2 w-2 rounded-full ${
                  index === activeIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          label={t("Settings")}
          className="w-full"
          onClick={() => router.push("/app/auth/drawer/settings")}
        />
      </div>
    </div>
  );
}
