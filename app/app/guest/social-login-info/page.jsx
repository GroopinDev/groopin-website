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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/app/guest/login");
      return;
    }

    const redirectIfComplete = (user) => {
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
    const normalizedEmail = email.trim().toLowerCase();
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
        body: { email: normalizedEmail },
        auth: true
      });
      if (response?.status === "already-verified") {
        router.replace("/app/auth/drawer/tabs");
        return;
      }

      const userResponse = await apiRequest("user", { method: "GET" });
      const token = getToken();
      if (token) {
        setSession(token, userResponse?.data);
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
