"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import UserAvatar from "../../../../../../components/user/user-avatar";
import Button from "../../../../../../components/ui/button";
import { useI18n } from "../../../../../../components/i18n-provider";
import { apiRequest } from "../../../../../lib/api-client";

const getAge = (user) => {
  if (typeof user?.age === "number") return user.age;
  if (!user?.date_of_birth) return null;
  const date = new Date(user.date_of_birth);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Date.now() - date.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function OfferParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [offer, setOffer] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setStatus("loading");
      setError("");
      try {
        const payload = await apiRequest(`offers/${params.id}`);
        if (!isMounted) return;
        const data = payload?.data || null;
        setOffer(data);
        setParticipants(data?.participants || []);
        setStatus("ready");
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || t("general.error_has_occurred"));
        setStatus("error");
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [params.id, t]);

  const ownerId = offer?.owner?.id;
  const ownerParticipant = useMemo(
    () => participants.find((user) => user.id === ownerId),
    [participants, ownerId]
  );
  const otherParticipants = useMemo(
    () => participants.filter((user) => user.id !== ownerId),
    [participants, ownerId]
  );

  if (status === "loading") {
    return <div className="h-40 animate-pulse rounded-2xl bg-neutral-100" />;
  }

  if (status === "error") {
    return <p className="text-sm text-danger-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <Button variant="link" label={t("Close")} onClick={() => router.back()} />

      <div>
        <h1 className="text-2xl font-semibold text-primary-900">
          {t("Participants")}
        </h1>
      </div>

      {ownerParticipant ? (
        <div className="rounded-2xl border border-[#EADAF1] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            {t("Organizer")}
          </p>
          <Link
            href={`/app/auth/users/${ownerParticipant.id}`}
            className="mt-3 flex items-center gap-3"
          >
            <UserAvatar user={ownerParticipant} size={56} withBorder />
            <div>
              <p className="text-sm font-semibold text-primary-900">
                {ownerParticipant.first_name} {ownerParticipant.last_name}
              </p>
              <p className="text-xs text-secondary-400">
                {getAge(ownerParticipant)
                  ? t("years_old", { count: getAge(ownerParticipant) })
                  : ""}
              </p>
            </div>
          </Link>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-800">
            {t("Participants")}
          </h2>
          <span className="text-sm text-secondary-400">
            {otherParticipants.length}
          </span>
        </div>

        {otherParticipants.length === 0 ? (
          <p className="text-sm text-secondary-400">
            {t("No participants yet")}
          </p>
        ) : (
          <div className="space-y-3">
            {otherParticipants.map((user) => (
              <Link
                key={user.id}
                href={`/app/auth/users/${user.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#EADAF1] bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} size={52} withBorder />
                  <div>
                    <p className="text-sm font-semibold text-primary-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-secondary-400">
                      {getAge(user)
                        ? t("years_old", { count: getAge(user) })
                        : ""}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-secondary-500">
                  {t("Profile")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
