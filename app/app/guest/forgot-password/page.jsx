"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { useI18n } from "../../../../components/i18n-provider";
import { apiRequest } from "../../../lib/api-client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();

    if (!email) {
      setStatus(t("validation.required_field"));
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      await apiRequest("forgot-password", {
        method: "POST",
        body: { email },
        auth: false
      });
      router.push(`/app/guest/otp-forgot-password-verification?email=${email}`);
    } catch (error) {
      setStatus(error?.data?.message || t("general.error_has_occurred"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-1 pb-10 pt-6">
      <h1 className="mb-3 mt-6 text-3xl font-bold text-primary-800">
        {t("auth.forgot_password_title")}
      </h1>
      <p className="mb-8 text-secondary-400">
        {t("auth.forgot_password_description")}
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <Input name="email" label={t("Email")} type="email" required />
        {status ? (
          <p className="text-sm text-danger-600">{status}</p>
        ) : null}
        <Button
          type="submit"
          label={submitting ? t("auth.sending_verification_email") : t("auth.send_reset_link")}
          size="lg"
          className="w-full"
          disabled={submitting}
        />
      </form>
    </div>
  );
}
