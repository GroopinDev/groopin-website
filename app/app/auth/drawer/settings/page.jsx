"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Button from "../../../../../components/ui/button";
import Modal from "../../../../../components/ui/modal";
import UserAvatar from "../../../../../components/user/user-avatar";
import { useI18n } from "../../../../../components/i18n-provider";
import { apiRequest } from "../../../../lib/api-client";
import { normalizeLocale } from "../../../../lib/i18n";
import { getToken, getUser, setSession } from "../../../../lib/session";

const getUserLabel = (user, fallbackLabel) => {
  if (!user) return fallbackLabel;
  if (user.name) return user.name;
  const first = user.first_name || "";
  const last = user.last_name || "";
  const combined = `${first} ${last}`.trim();
  return combined || fallbackLabel;
};

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const [blockedOpen, setBlockedOpen] = useState(false);
  const [blockedStatus, setBlockedStatus] = useState("idle");
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [blockedError, setBlockedError] = useState("");
  const [unblockingId, setUnblockingId] = useState(null);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageError, setLanguageError] = useState("");
  const [languageLoading, setLanguageLoading] = useState(false);

  const blockedLabel = useMemo(() => {
    if (!blockedUsers) return t("Loading more...");
    if (blockedUsers.length === 0) return t("nothing");
    return String(blockedUsers.length);
  }, [blockedUsers, t]);

  const languageLabel =
    locale === "fr"
      ? t("settings.french")
      : locale === "ar"
        ? t("settings.arabic")
        : t("settings.english");

  const loadBlockedUsers = async () => {
    setBlockedStatus("loading");
    setBlockedError("");
    try {
      const payload = await apiRequest("blocked-users");
      const list = Array.isArray(payload?.data) ? payload.data : [];
      setBlockedUsers(list);
      setBlockedStatus("ready");
    } catch (error) {
      setBlockedUsers([]);
      setBlockedStatus("error");
      setBlockedError(error?.message || "Unable to load blocked users.");
    }
  };

  useEffect(() => {
    if (!blockedOpen) return;
    loadBlockedUsers();
  }, [blockedOpen]);

  const handleUnblock = async (userId) => {
    if (unblockingId) return;
    setUnblockingId(userId);
    setBlockedError("");
    try {
      await apiRequest(`block-user/${userId}`, { method: "DELETE" });
      setBlockedUsers((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== userId) : prev
      );
    } catch (error) {
      setBlockedError(error?.message || "Unable to unblock user.");
    } finally {
      setUnblockingId(null);
    }
  };

  const handleLanguageSelect = async (locale) => {
    if (languageLoading) return;
    setLanguageError("");
    setLanguageLoading(true);
    try {
      const payload = await apiRequest("profile/locale", {
        method: "PUT",
        body: { locale }
      });
      const updatedUser = payload?.data || null;
      const token = getToken();
      if (updatedUser && token) {
        setSession(token, updatedUser);
      }
      setLocale(normalizeLocale(locale));
      setLanguageOpen(false);
    } catch (error) {
      setLanguageError(error?.message || "Unable to update language.");
    } finally {
      setLanguageLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-900">
          {t("Settings")}
        </h1>
      </div>

      <SectionCard title={t("Profile")}>
        <SettingsItem
          label={t("Edit Profile")}
          href="/app/auth/profile/edit"
          icon={<PencilIcon />}
        />
      </SectionCard>

      <SectionCard title={t("Account & Security")}>
        <SettingsItem
          label={t("Account Settings")}
          href="/app/auth/drawer/settings/account"
          icon={<KeyIcon />}
        />
        <SettingsItem
          label={t("blocked users")}
          onClick={() => setBlockedOpen(true)}
          value={blockedLabel}
          icon={<BlockIcon />}
        />
      </SectionCard>

      <SectionCard title={t("Preferences")}>
        <SettingsItem
          label={t("settings.language")}
          onClick={() => {
            setLanguageError("");
            setLanguageOpen(true);
          }}
          value={languageLabel}
          icon={<LanguageIcon />}
        />
      </SectionCard>

      <SectionCard title={t("About")}>
        <SettingsItem
          label={t("Onboarding")}
          href="/app/auth/onboarding"
          icon={<InfoIcon />}
        />
      </SectionCard>

      <Modal
        open={blockedOpen}
        title={t("blocked users")}
        onClose={() => setBlockedOpen(false)}
      >
        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
          {blockedStatus === "loading" ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`blocked-skeleton-${index}`}
                  className="h-12 animate-pulse rounded-2xl bg-neutral-100"
                />
              ))}
            </div>
          ) : null}

          {blockedStatus === "error" ? (
            <p className="text-sm text-danger-600">{blockedError}</p>
          ) : null}

          {blockedStatus === "ready" && blockedUsers?.length === 0 ? (
            <p className="text-sm text-secondary-400">
              {t("nothingToShow")}
            </p>
          ) : null}

          {Array.isArray(blockedUsers) && blockedUsers.length > 0
            ? blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#EADAF1] px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={user} size={44} withBorder />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-primary-900">
                        {getUserLabel(user, t("Profile"))}
                      </p>
                      {user.email ? (
                        <p className="truncate text-xs text-secondary-400">
                          {user.email}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    label={unblockingId === user.id ? "..." : t("unblock")}
                    className="px-4"
                    disabled={unblockingId === user.id}
                    onClick={() => handleUnblock(user.id)}
                  />
                </div>
              ))
            : null}
        </div>

        {blockedError && blockedStatus !== "error" ? (
          <p className="mt-3 text-xs text-danger-600">{blockedError}</p>
        ) : null}

        <div className="mt-4">
          <Button
            variant="outline"
            label={t("Close")}
            className="w-full"
            onClick={() => setBlockedOpen(false)}
          />
        </div>
      </Modal>

      <Modal
        open={languageOpen}
        title={t("settings.language")}
        onClose={() => setLanguageOpen(false)}
      >
        <div className="mt-5 space-y-3">
          <Button
            label={t("settings.english")}
            className="w-full"
            disabled={languageLoading}
            onClick={() => handleLanguageSelect("en")}
          />
          <Button
            label={t("settings.french")}
            className="w-full"
            disabled={languageLoading}
            onClick={() => handleLanguageSelect("fr")}
          />
          <Button
            label={t("settings.arabic")}
            className="w-full"
            disabled={languageLoading}
            onClick={() => handleLanguageSelect("ar")}
          />
          <Button
            variant="outline"
            label={t("Cancel")}
            className="w-full"
            onClick={() => setLanguageOpen(false)}
          />
        </div>
        {languageError ? (
          <p className="mt-3 text-xs text-danger-600">{languageError}</p>
        ) : null}
      </Modal>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="rounded-3xl border border-[#EADAF1] bg-white p-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-700">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-[#F1E5F6]">{children}</div>
    </section>
  );
}

function SettingsItem({ icon, label, description, value, href, onClick }) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600/10 text-primary-700">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-primary-900">{label}</p>
          {description ? (
            <p className="text-xs text-secondary-400">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-secondary-400">
        {value ? <span>{value}</span> : null}
        <ChevronIcon />
      </div>
    </>
  );

  const className =
    "flex w-full items-center justify-between gap-4 py-4 text-left";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="10" r="3" />
      <path d="M10.7 12.7 17 19l2-2-4-4 2-2-2-2-3.3 3.3" />
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m5.5 5.5 13 13" />
    </svg>
  );
}

function LanguageIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h7" />
      <path d="M9 5s0 6-4 10" />
      <path d="M5 9h7" />
      <path d="M15 5h5" />
      <path d="M15 9h4" />
      <path d="M17 3v6" />
      <path d="m14 17 4-9 4 9" />
      <path d="M15 17h6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}
