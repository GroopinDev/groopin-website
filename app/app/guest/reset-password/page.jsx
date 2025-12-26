"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "../../../../components/ui/button";
import Input from "../../../../components/ui/input";
import { useI18n } from "../../../../components/i18n-provider";
import { apiRequest } from "../../../lib/api-client";

function ResetPasswordContent() {
  const router = useRouter();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      setSubmitting(true);
      setStatus("");
      await apiRequest(`reset-password/${token}`, {
        method: "POST",
        body: {
          email,
          password: formData.get("password")?.toString(),
          password_confirmation: formData
            .get("password_confirmation")
            ?.toString()
        },
        auth: false
      });
      router.replace("/app/guest/login");
    } catch (error) {
      setStatus(error?.data?.message || t("general.error_has_occurred"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-1 pb-10 pt-6">
      <h1 className="mb-3 mt-6 text-3xl font-bold text-primary-800">
        {t("auth.reset_password_title")}
      </h1>
      <p className="mb-8 text-secondary-400">
        {t("auth.reset_password_description")}
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <Input name="password" label={t("Password")} type="password" required />
        <Input
          name="password_confirmation"
          label={t("auth.password_confirmation")}
          type="password"
          required
        />

        {status ? (
          <p className="text-sm text-danger-600">{status}</p>
        ) : null}

        <Button
          type="submit"
          label={submitting ? t("Update") : t("auth.reset_password")}
          size="lg"
          className="w-full"
          disabled={submitting}
        />
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-4 py-10 text-sm text-secondary-400">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
