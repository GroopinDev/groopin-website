"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import UserAvatar from "../../../../../components/user/user-avatar";
import Button from "../../../../../components/ui/button";
import Input from "../../../../../components/ui/input";
import RadioGroup from "../../../../../components/ui/radio-group";
import { apiRequest } from "../../../../lib/api-client";
import { getToken, getUser, setSession } from "../../../../lib/session";

const buildUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (path.startsWith("http")) return path;
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

const getLanguageHeader = () => {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.split("-")[0] || "en";
};

const normalizeFieldError = (errors, field) => {
  const value = errors?.[field];
  if (Array.isArray(value)) return value[0];
  return value || "";
};

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(() => getUser());
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    sex: "male",
    date_of_birth: "",
    bio: "",
    dynamic_questions: {}
  });
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const compressAvatarImage = async (file) => {
    const maxDimension = 1024;
    const maxSize = 500 * 1024;
    if (!file || !file.type?.startsWith("image/")) return file;
    if (file.size <= maxSize && file.type !== "image/png") {
      return file;
    }

    const loadImage = async () => {
      if (typeof createImageBitmap === "function") {
        return createImageBitmap(file);
      }
      return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(img);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject();
        };
        img.src = objectUrl;
      });
    };

    try {
      const image = await loadImage();
      const width = image.width || image.naturalWidth;
      const height = image.height || image.naturalHeight;
      const maxSide = Math.max(width, height);
      const scale = maxSide > maxDimension ? maxDimension / maxSide : 1;
      const targetWidth = Math.round(width * scale);
      const targetHeight = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) return file;

      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      const outputType =
        file.type === "image/png" ? "image/png" : "image/jpeg";
      const quality = outputType === "image/jpeg" ? 0.8 : undefined;

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, outputType, quality);
      });

      if (!blob) return file;
      if (blob.size >= file.size && scale === 1) return file;

      return new File([blob], file.name, { type: outputType });
    } catch {
      return file;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [userPayload, paramsPayload] = await Promise.all([
          apiRequest("user"),
          apiRequest("parameters")
        ]);
        if (!isMounted) return;
        const loadedUser = userPayload?.data || userPayload;
        const dynamicAnswers = Array.isArray(loadedUser?.dynamic_answers)
          ? {}
          : loadedUser?.dynamic_answers || {};

        setUser(loadedUser);
        setFormValues({
          first_name: loadedUser?.first_name || "",
          last_name: loadedUser?.last_name || "",
          sex: loadedUser?.sex || "male",
          date_of_birth: loadedUser?.date_of_birth || "",
          bio: loadedUser?.bio || "",
          dynamic_questions: dynamicAnswers
        });
        const dynamicGroups = paramsPayload?.dynamic_questions || {};
        setDynamicQuestions(
          dynamicGroups.user || dynamicGroups["App\\\\Models\\\\User"] || []
        );
        setStatus("ready");
      } catch (error) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(
          error?.message || "Unable to load profile data. Try again."
        );
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const updateDynamicQuestion = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      dynamic_questions: {
        ...(prev.dynamic_questions || {}),
        [name]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setFieldErrors({});

    const cleanedDynamicQuestions = Object.fromEntries(
      Object.entries(formValues.dynamic_questions || {}).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    const payload = {
      first_name: formValues.first_name.trim(),
      last_name: formValues.last_name.trim(),
      sex: formValues.sex,
      date_of_birth: formValues.date_of_birth || null,
      bio: formValues.bio?.trim() || null,
      dynamic_questions: cleanedDynamicQuestions
    };

    try {
      const response = await apiRequest("profile/profile-information", {
        method: "PUT",
        body: payload
      });
      const updatedUser = response?.data || response;
      const token = getToken();
      if (token) {
        setSession(token, updatedUser);
      }
      setUser(updatedUser);
      router.push("/app/auth/drawer/tabs/profile");
    } catch (error) {
      setMessage(
        error?.data?.message ||
          error?.message ||
          "Unable to update profile. Try again."
      );
      setFieldErrors(error?.data?.errors || {});
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage("");
    setFieldErrors({});

    try {
      const token = getToken();
      const formData = new FormData();
      const optimizedFile = await compressAvatarImage(file);
      formData.append("avatar", optimizedFile);

      const response = await fetch(buildUrl("profile/avatar"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Language": getLanguageHeader(),
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to upload avatar.");
      }

      const updatedUser = payload?.data || payload;
      const tokenValue = getToken();
      if (tokenValue) {
        setSession(tokenValue, updatedUser);
      }
      setUser(updatedUser);
    } catch (error) {
      setMessage(error?.message || "Unable to upload avatar.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-4 w-64 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    );
  }

  if (status === "error") {
    return <p className="text-sm text-danger-600">{message}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-800">Edit profile</h1>
        <p className="text-sm text-secondary-400">
          Update your personal details and preferences.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <UserAvatar user={user} size={96} withBorder />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
        <Button
          variant="outline"
          size="sm"
          className="px-6"
          label={isUploading ? "Uploading..." : "Change photo"}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="mb-2 text-neutral-700">Sex</p>
          <RadioGroup
            name="sex"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" }
            ]}
            value={formValues.sex}
            onChange={(value) => updateField("sex", value)}
          />
          {normalizeFieldError(fieldErrors, "sex") ? (
            <p className="mt-2 text-sm text-danger-600">
              {normalizeFieldError(fieldErrors, "sex")}
            </p>
          ) : null}
        </div>

        <Input
          name="first_name"
          label="First name"
          value={formValues.first_name}
          onChange={(event) => updateField("first_name", event.target.value)}
          error={normalizeFieldError(fieldErrors, "first_name")}
          required
        />
        <Input
          name="last_name"
          label="Last name"
          value={formValues.last_name}
          onChange={(event) => updateField("last_name", event.target.value)}
          error={normalizeFieldError(fieldErrors, "last_name")}
          required
        />
        <Input
          name="date_of_birth"
          label="Date of birth"
          type="date"
          value={formValues.date_of_birth || ""}
          onChange={(event) => updateField("date_of_birth", event.target.value)}
          error={normalizeFieldError(fieldErrors, "date_of_birth")}
        />

        {dynamicQuestions.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-primary-800">
              Extra information
            </p>
            {dynamicQuestions.map((question) => {
              const questionValue =
                formValues.dynamic_questions?.[question.name] ?? "";
              const error = normalizeFieldError(
                fieldErrors,
                `dynamic_questions.${question.name}`
              );

              if (question.type === "text") {
                return (
                  <Input
                    key={question.id}
                    label={question.label}
                    value={questionValue}
                    onChange={(event) =>
                      updateDynamicQuestion(question.name, event.target.value)
                    }
                    error={error}
                  />
                );
              }

              if (question.type === "select" || question.type === "select_buttons") {
                return (
                  <div key={question.id} className="space-y-1">
                    <label className="mb-1 block text-lg text-primary-500">
                      {question.label}
                    </label>
                    <select
                      value={questionValue}
                      onChange={(event) =>
                        updateDynamicQuestion(question.name, event.target.value)
                      }
                      className={`w-full rounded-full border-2 px-4 py-3 text-secondary-400 outline-none focus:border-primary-500 ${
                        error ? "border-danger-600" : "border-[#EADAF1]"
                      }`}
                    >
                      <option value="">Select</option>
                      {(question.formatted_settings?.options || []).map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                    {error ? (
                      <p className="mt-2 text-sm text-danger-600">{error}</p>
                    ) : null}
                  </div>
                );
              }

              if (question.type === "date") {
                return (
                  <Input
                    key={question.id}
                    label={question.label}
                    type="date"
                    value={questionValue || ""}
                    onChange={(event) =>
                      updateDynamicQuestion(question.name, event.target.value)
                    }
                    error={error}
                  />
                );
              }

              return null;
            })}
          </div>
        ) : null}

        <div className="space-y-1">
          <label className="mb-1 block text-lg text-primary-500">Bio</label>
          <textarea
            rows={4}
            value={formValues.bio || ""}
            onChange={(event) => updateField("bio", event.target.value)}
            className={`w-full rounded-2xl border-2 px-4 py-3 text-secondary-400 outline-none focus:border-primary-500 ${
              normalizeFieldError(fieldErrors, "bio")
                ? "border-danger-600"
                : "border-[#EADAF1]"
            }`}
            placeholder="Tell people more about you."
          />
          {normalizeFieldError(fieldErrors, "bio") ? (
            <p className="mt-2 text-sm text-danger-600">
              {normalizeFieldError(fieldErrors, "bio")}
            </p>
          ) : null}
        </div>

        {message ? <p className="text-sm text-danger-600">{message}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            label="Cancel"
            className="w-full"
            onClick={() => router.back()}
          />
          <Button
            type="submit"
            label={isSaving ? "Saving..." : "Save changes"}
            className="w-full"
            disabled={isSaving}
          />
        </div>
      </form>
    </div>
  );
}
