"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { useI18n } from "../../../../components/i18n-provider";
import { apiRequest } from "../../../lib/api-client";

function OtpForgotPasswordVerificationContent() {
  const router = useRouter();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(59);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const canResend = countdown === 0;
  const resendLabel = useMemo(() => {
    if (countdown > 0) {
      return t("auth.resend_otp_countdown", { seconds: countdown });
    }
    return t("auth.resend_otp");
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
      const response = await apiRequest("otp/verify", {
        method: "POST",
        body: { email, code },
        auth: false
      });

      router.push(
        `/app/guest/reset-password?email=${email}&token=${response.token}`
      );
    } catch (error) {
      setStatus(error?.data?.message || t("general.error_has_occurred"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await apiRequest("forgot-password", {
        method: "POST",
        body: { email },
        auth: false
      });
      setCountdown(59);
    } catch (error) {
      setStatus(error?.data?.message || t("general.error_has_occurred"));
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-1 pb-10 pt-6">
      <h1 className="mb-3 mt-6 text-3xl font-bold text-primary-800">
        {t("auth.verify_otp_title")}
      </h1>
      <p className="mb-8 text-secondary-400">
        {t("auth.verify_otp_description")}
      </p>

      <form onSubmit={handleVerify} className="space-y-5">
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
          disabled={!canResend}
          onClick={handleResend}
        />
      </form>
    </div>
  );
}

export default function OtpForgotPasswordVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-4 py-10 text-sm text-secondary-400">
          Loading...
        </div>
      }
    >
      <OtpForgotPasswordVerificationContent />
    </Suspense>
  );
}
