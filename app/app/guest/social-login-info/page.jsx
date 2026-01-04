"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { useI18n } from "../../../../components/i18n-provider";
import { apiRequest } from "../../../lib/api-client";
import { getToken, getUser, setSession } from "../../../lib/session";

export default function SocialLoginInfoPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const normalizeNameValue = (value) => {
    const trimmed = value?.trim() || "";
    if (!trimmed) return "";
    return trimmed.toLowerCase() === "user" ? "" : trimmed;
  };

  const hasCompleteName = (user) => {
    const normalizedFirstName = normalizeNameValue(user?.first_name);
    const normalizedLastName = normalizeNameValue(user?.last_name);
    return Boolean(normalizedFirstName && normalizedLastName);
  };

  const hydrateFields = (user) => {
    if (!user) return;
    const cachedEmail = user.email || "";
    if (cachedEmail) {
      setEmail(cachedEmail);
    }
    setFirstName(normalizeNameValue(user.first_name));
    setLastName(normalizeNameValue(user.last_name));
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/app/guest/login");
      return;
    }

    const redirectIfComplete = (user) => {
      hydrateFields(user);
      if (!hasCompleteName(user)) {
        return;
      }

      const cachedEmail = user?.email?.toLowerCase() || "";
      if (cachedEmail && !cachedEmail.endsWith("@privaterelay.appleid.com")) {
        if (user?.is_verified === false) {
          router.replace("/app/auth/otp-verify-email-verification");
          return;
        }
        router.replace("/app/auth/drawer/tabs");
      }
    };

    const cachedUser = getUser();
    if (cachedUser) {
      redirectIfComplete(cachedUser);
      return;
    }

    apiRequest("user", { method: "GET" })
      .then((payload) => {
        const user = payload?.data;
        if (user) {
          setSession(token, user);
        }
        redirectIfComplete(user);
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedFirstName || !normalizedLastName) {
      setStatus(t("auth.social_name_error"));
      return;
    }
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setStatus(t("validation.email"));
      return;
    }
    if (normalizedEmail.endsWith("@privaterelay.appleid.com")) {
      setStatus(t("auth.social_email_relay_error"));
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      const response = await apiRequest("email/change", {
        method: "POST",
        body: {
          email: normalizedEmail,
          first_name: normalizedFirstName,
          last_name: normalizedLastName
        },
        auth: true
      });
      const userResponse = await apiRequest("user", {
        method: "GET",
        cache: false,
        dedupe: false
      });
      const token = getToken();
      if (token) {
        setSession(token, userResponse?.data);
      }

      if (response?.status === "already-verified") {
        router.replace("/app/auth/drawer/tabs");
        return;
      }

      router.push("/app/auth/otp-verify-email-verification?isSent=true");
    } catch (error) {
      setStatus(error?.data?.message || t("general.error_has_occurred"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-1 pb-10 pt-6">
      <h1 className="mb-3 mt-6 text-3xl font-bold text-primary-800">
        {t("auth.social_email_title")}
      </h1>
      <p className="mb-6 text-secondary-400">
        {t("auth.social_email_description")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          name="first_name"
          label={t("First Name")}
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          autoComplete="given-name"
          autoCapitalize="words"
          disabled={submitting}
          required
        />
        <Input
          name="last_name"
          label={t("Last Name")}
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          autoComplete="family-name"
          autoCapitalize="words"
          disabled={submitting}
          required
        />
        <Input
          name="email"
          label={t("Email")}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          autoCapitalize="none"
          disabled={submitting}
          required
        />

        {status ? (
          <p className="text-sm text-danger-600">{status}</p>
        ) : null}

        <Button
          type="submit"
          label={submitting ? t("auth.sending_verification_email") : t("auth.social_email_submit")}
          size="lg"
          className="w-full"
          disabled={submitting}
        />
      </form>
    </div>
  );
}
