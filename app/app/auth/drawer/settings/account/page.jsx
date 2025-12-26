"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../../../../../../components/ui/button";
import Input from "../../../../../../components/ui/input";
import Modal from "../../../../../../components/ui/modal";
import UserAvatar from "../../../../../../components/user/user-avatar";
import { useI18n } from "../../../../../../components/i18n-provider";
import { apiRequest } from "../../../../../lib/api-client";
import {
  clearSession,
  getToken,
  getUser,
  setSession
} from "../../../../../lib/session";

const initialPasswordState = {
  current_password: "",
  password: "",
  password_confirmation: ""
};

const normalizeFieldError = (errors, field) => {
  const value = errors?.[field];
  if (Array.isArray(value)) return value[0];
  return value || "";
};

export default function AccountSettingsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [user, setUser] = useState(() => getUser());
  const [status, setStatus] = useState(user ? "ready" : "loading");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState(initialPasswordState);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    let isMounted = true;
    apiRequest("user")
      .then((payload) => {
        if (!isMounted) return;
        const userData = payload?.data || null;
        if (userData) {
          const token = getToken();
          if (token) {
            setSession(token, userData);
          }
        }
        setUser(userData);
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

  const resetPasswordForm = () => {
    setPasswordForm(initialPasswordState);
    setPasswordErrors({});
    setPasswordMessage("");
  };

  const openPasswordModal = () => {
    resetPasswordForm();
    setPasswordModalOpen(true);
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.current_password.trim()) {
      errors.current_password = t("Current password is required");
    }
    if (!passwordForm.password) {
      errors.password = t("New password is required");
    } else if (passwordForm.password.length < 8) {
      errors.password = t("Password must be at least 8 characters");
    }
    if (!passwordForm.password_confirmation) {
      errors.password_confirmation = t("Password confirmation is required");
    } else if (
      passwordForm.password &&
      passwordForm.password_confirmation !== passwordForm.password
    ) {
      errors.password_confirmation = t("Passwords do not match");
    }
    return errors;
  };

  const handlePasswordChange = async () => {
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    setPasswordErrors({});
    setPasswordMessage("");
    setIsSavingPassword(true);
    try {
      await apiRequest("profile/password", {
        method: "PUT",
        body: passwordForm
      });
    } catch (error) {
      setPasswordErrors(error?.data?.errors || {});
      setPasswordMessage(
        error?.data?.message || error?.message || t("general.error_has_occurred")
      );
      setIsSavingPassword(false);
      return;
    }

    try {
      await apiRequest("logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      clearSession();
      router.replace("/app/guest/login");
    }
  };

  const handleLogout = async () => {
    if (actionLoading) return;
    setActionLoading("logout");
    setActionError("");
    try {
      await apiRequest("logout", { method: "POST" });
      clearSession();
      router.replace("/app/guest/login");
    } catch (error) {
      setActionError(error?.message || t("general.error_has_occurred"));
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteAccount = async () => {
    if (actionLoading) return;
    setActionLoading("delete");
    setActionError("");
    try {
      await apiRequest("user/delete", { method: "DELETE" });
      clearSession();
      router.replace("/app/guest/login");
    } catch (error) {
      setActionError(error?.message || t("general.error_has_occurred"));
    } finally {
      setActionLoading("");
    }
  };

  if (status === "error") {
    return (
      <p className="text-sm text-danger-600">
        {t("general.error_has_occurred")}
      </p>
    );
  }

  if (!user && status === "loading") {
    return (
      <div className="space-y-3">
        <div className="h-6 w-32 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-32 animate-pulse rounded-3xl bg-neutral-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">
            {t("Account")}
          </h1>
        </div>
        <Button
          variant="link"
          label={t("Close")}
          onClick={() => router.back()}
        />
      </div>

      <SectionCard title={t("Account Information")}>
        <div className="flex flex-col items-center py-4">
          <UserAvatar user={user} size={86} withBorder />
          <p className="mt-3 text-lg font-semibold text-primary-900">
            {user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`}
          </p>
          <p className="text-sm text-secondary-400">{user?.email || "-"}</p>
        </div>
      </SectionCard>

      <SectionCard title={t("Security & Privacy")}>
        <SettingsItem
          label={t("Change Password")}
          onClick={openPasswordModal}
          icon={<LockIcon />}
        />
      </SectionCard>

      <SectionCard title={t("Account Management")}>
        <SettingsItem
          label={t("Logout")}
          onClick={() => {
            setActionError("");
            setLogoutModalOpen(true);
          }}
          icon={<LogoutIcon />}
        />
        <SettingsItem
          label={t("delete account")}
          onClick={() => {
            setActionError("");
            setDeleteModalOpen(true);
          }}
          icon={<DeleteIcon />}
        />
      </SectionCard>

      <Modal
        open={passwordModalOpen}
        title={t("Change Password")}
        onClose={() => setPasswordModalOpen(false)}
      >
        <p className="text-sm text-secondary-500">
          {t(
            "After changing your password, you will be logged out and need to login with your new password."
          )}
        </p>
        <div className="mt-5 space-y-4">
          <Input
            label={t("Current Password")}
            type="password"
            value={passwordForm.current_password}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                current_password: event.target.value
              }))
            }
            error={normalizeFieldError(passwordErrors, "current_password")}
          />
          <Input
            label={t("New Password")}
            type="password"
            value={passwordForm.password}
            onChange={(event) =>
              setPasswordForm((prev) => ({ ...prev, password: event.target.value }))
            }
            error={normalizeFieldError(passwordErrors, "password")}
          />
          <Input
            label={t("Confirm new password")}
            type="password"
            value={passwordForm.password_confirmation}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                password_confirmation: event.target.value
              }))
            }
            error={normalizeFieldError(passwordErrors, "password_confirmation")}
          />
        </div>
        {passwordMessage ? (
          <p className="mt-3 text-xs text-danger-600">{passwordMessage}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            label={t("Cancel")}
            className="w-full"
            onClick={() => setPasswordModalOpen(false)}
            disabled={isSavingPassword}
          />
          <Button
            label={t("Update")}
            className="w-full"
            onClick={handlePasswordChange}
            loading={isSavingPassword}
          />
        </div>
      </Modal>

      <Modal
        open={logoutModalOpen}
        title={t("Logout")}
        onClose={() => setLogoutModalOpen(false)}
      >
        <p className="text-sm text-secondary-500">
          {t(
            "Are you sure you want to logout? You will need to login again to access your account."
          )}
        </p>
        {actionError ? (
          <p className="mt-3 text-xs text-danger-600">{actionError}</p>
        ) : null}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            label={t("Cancel")}
            className="w-full"
            onClick={() => setLogoutModalOpen(false)}
            disabled={actionLoading === "logout"}
          />
          <Button
            label={t("Logout")}
            className="w-full"
            onClick={handleLogout}
            loading={actionLoading === "logout"}
          />
        </div>
      </Modal>

      <Modal
        open={deleteModalOpen}
        title={t("delete account")}
        onClose={() => setDeleteModalOpen(false)}
      >
        <p className="text-sm text-secondary-500">
          {t("delete account info")}
        </p>
        {actionError ? (
          <p className="mt-3 text-xs text-danger-600">{actionError}</p>
        ) : null}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            label={t("Cancel")}
            className="w-full"
            onClick={() => setDeleteModalOpen(false)}
            disabled={actionLoading === "delete"}
          />
          <Button
            variant="destructive"
            label={t("delete account")}
            className="w-full"
            onClick={handleDeleteAccount}
            loading={actionLoading === "delete"}
          />
        </div>
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

function SettingsItem({ icon, label, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
    >
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
      <ChevronIcon />
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
      className="text-secondary-400"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LockIcon() {
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
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  );
}

function LogoutIcon() {
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
      <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function DeleteIcon() {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 6l1 14h10l1-14" />
    </svg>
  );
}
