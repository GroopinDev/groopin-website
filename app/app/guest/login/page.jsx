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
  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          disabled={submitting}
          required
          rightAddon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-400 transition hover:text-secondary-600"
              aria-label={showPassword ? t("Hide password") : t("Show password")}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
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
          size="lg"
          className="w-full !bg-[#DB4437] hover:!bg-[#C23321]"
          loading={socialLoading === "google"}
          onClick={() => handleSocialLogin("google")}
        >
          <span className="flex items-center justify-center gap-3">
            <GoogleIcon />
            <span>Google</span>
          </span>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full !bg-black hover:!bg-black"
          loading={socialLoading === "apple"}
          onClick={() => handleSocialLogin("apple")}
        >
          <span className="flex items-center justify-center gap-3">
            <AppleIcon />
            <span>Apple</span>
          </span>
        </Button>
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

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2.5 2.5 0 0 0 3.4 3.4" />
      <path d="M9.2 5.2C10.1 4.9 11.1 4.7 12 4.7c6.5 0 10 7.3 10 7.3a17.3 17.3 0 0 1-4.2 4.8" />
      <path d="M6.1 6.1A16.8 16.8 0 0 0 2 12s3.5 6 10 6c1 0 2-.2 2.9-.5" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.7-5.5 3.7-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C17.8 3.5 15.3 2.3 12 2.3 6.9 2.3 2.7 6.5 2.7 11.7c0 5.2 4.2 9.4 9.3 9.4 5.4 0 8.9-3.8 8.9-9.2 0-.6-.1-1.1-.2-1.6H12Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 13.2c0-2 1.6-2.9 1.7-3-1-.9-2.4-1-2.9-1-1.2-.1-2.3.7-2.9.7s-1.5-.7-2.5-.7c-1.3 0-2.5.8-3.2 2-1.4 2.5-.4 6.2 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.6 2.6-.6s1.5.6 2.5.6c1.1 0 1.8-1 2.5-2 0 0 1.5-2.1 1.2-4.4-.1 0-2.1-.8-2.1-3Z" />
      <path d="M14.9 6.8c.6-.7 1-1.7.9-2.8-.9.1-2 .6-2.6 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.1Z" />
    </svg>
  );
}
