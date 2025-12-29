"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { useI18n } from "../../../../components/i18n-provider";
import { apiRequest } from "../../../lib/api-client";
import { getToken, setSession } from "../../../lib/session";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  useEffect(() => {
    if (getToken()) {
      router.replace("/app/auth/drawer/tabs");
    }
  }, [router]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!email || !password) {
      setStatus(t("Invalid email or password"));
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      const response = await apiRequest("login", {
        method: "POST",
        body: { email, password },
        auth: false
      });

      if (!response?.meta?.token) {
        throw new Error("Missing auth token");
      }

      setSession(response.meta.token, response.data);

      if (response.data?.is_verified === false) {
        router.push("/app/auth/otp-verify-email-verification");
      } else {
        router.push("/app/auth/drawer/tabs");
      }
    } catch (error) {
      setStatus(
        error?.data?.message || t("Invalid email or password")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setSocialLoading(provider);
      setStatus("");
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/app/guest/social-callback`
          : "";
      const path = redirectUrl
        ? `auth/${provider}/redirect?redirect_url=${encodeURIComponent(
            redirectUrl
          )}`
        : `auth/${provider}/redirect`;
      const response = await apiRequest(path, {
        method: "GET",
        auth: false
      });

      if (!response?.redirect_url) {
        throw new Error("Missing redirect URL");
      }

      window.location.href = response.redirect_url;
    } catch (error) {
      setStatus(
        error?.data?.message || t("general.error_has_occurred")
      );
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-1 pb-10 pt-6">
      <h1 className="mb-3 mt-6 text-center text-3xl font-bold text-primary-800">
        {t("auth.login_title")}
      </h1>
      <p className="mb-8 text-center text-secondary-400">
        {t("auth.login_description")}
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <Input
          name="email"
          label={t("Email")}
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          disabled={submitting}
          required
        />
        <Input
          name="password"
          label={t("Password")}
          type="password"
          autoComplete="current-password"
          disabled={submitting}
          required
        />

        {status ? (
          <p className="text-sm text-danger-600">{status}</p>
        ) : null}

        <Button
          type="submit"
          label={submitting ? t("Processing login") : t("auth.login")}
          size="lg"
          className="w-full"
          disabled={submitting}
        />
      </form>

      <Link
        href="/app/guest/forgot-password"
        className="mt-6 text-center text-lg text-primary-500"
      >
        {t("auth.forgot_password")}
      </Link>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-sm font-medium text-neutral-600">
          {t("auth.or_continue_with")}
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <div className="space-y-4">
        <Button
          variant="secondary"
          label="Google"
          size="lg"
          className="w-full !bg-[#DB4437] hover:!bg-[#C23321]"
          loading={socialLoading === "google"}
          onClick={() => handleSocialLogin("google")}
        />
        <Button
          variant="secondary"
          label="Apple"
          size="lg"
          className="w-full !bg-black hover:!bg-black"
          loading={socialLoading === "apple"}
          onClick={() => handleSocialLogin("apple")}
        />
      </div>

      <div className="mt-8 flex items-center justify-center gap-1 text-sm">
        <span className="text-neutral-600">
          {t("auth.dont_have_an_account")}
        </span>
        <Link href="/app/guest/register" className="font-medium text-primary-600">
          {t("auth.signup")}
        </Link>
      </div>
    </div>
  );
}
