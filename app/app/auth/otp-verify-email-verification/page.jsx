"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { useI18n } from "../../../../components/i18n-provider";
import { apiRequest } from "../../../lib/api-client";
import { clearSession, getToken, setSession } from "../../../lib/session";

function OtpVerifyEmailVerificationContent() {
  const router = useRouter();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const isSent = searchParams.get("isSent") === "true";
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(isSent ? 59 : 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resendLabel = useMemo(() => {
    if (countdown > 0) {
      return t("auth.resend_verification_countdown", { seconds: countdown });
    }
    return t("auth.resend_verification");
  }, [countdown, t]);

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!code || code.length < 6) {
      setStatus(t("general.invalid_submission"));
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      await apiRequest("verify-email", {
        method: "POST",
        body: { code },
        auth: true
      });

      const userResponse = await apiRequest("user", { method: "GET" });
      const token = getToken();
      if (token) {
        setSession(token, userResponse?.data);
      }
      router.push("/app/auth/success-registration");
    } catch (error) {
      setStatus(error?.data?.message || t("general.error_has_occurred"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await apiRequest("email/verification-notification", {
        method: "POST",
        auth: true
      });
      setCountdown(59);
    } catch (error) {
      setStatus(error?.data?.message || t("general.error_has_occurred"));
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      clearSession();
      router.replace("/app/guest/login");
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-10">
      <form onSubmit={handleVerify} className="space-y-5">
        <h1 className="mb-2 mt-4 text-3xl font-bold text-primary-800">
            {t("auth.verify_otp_title")}
          </h1>
          <p className="mb-6 text-secondary-400">
            {t("auth.verify_otp_description")}
          </p>

          <Input
            label={t("OTP Code")}
            name="code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputClassName="tracking-[0.5em] text-center text-lg"
            maxLength={6}
          />

          {status ? (
            <p className="text-sm text-danger-600">{status}</p>
          ) : null}

          <Button
            type="submit"
            label={submitting ? t("Processing login") : t("auth.verify_otp")}
            size="lg"
            className="w-full"
            disabled={submitting}
          />
          <Button
            type="button"
            variant="link"
            label={resendLabel}
            className="w-full"
            disabled={countdown > 0}
            onClick={handleResend}
          />
          <Button
            type="button"
            variant="link"
            label={t("Logout")}
            className="w-full"
            onClick={handleLogout}
          />
      </form>
    </div>
  );
}

export default function OtpVerifyEmailVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-4 py-10 text-sm text-secondary-400">
          Loading...
        </div>
      }
    >
      <OtpVerifyEmailVerificationContent />
    </Suspense>
  );
}
