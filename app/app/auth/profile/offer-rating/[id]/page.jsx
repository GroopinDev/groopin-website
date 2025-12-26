"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Button from "../../../../../../components/ui/button";
import UserAvatar from "../../../../../../components/user/user-avatar";
import { useI18n } from "../../../../../../components/i18n-provider";
import { apiRequest } from "../../../../../lib/api-client";
import { getUser } from "../../../../../lib/session";

const StarIcon = ({ filled }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "#B12587" : "none"}
    stroke="#B12587"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3.5 14.8 9l5.9.9-4.3 4.2 1 5.8L12 17.8 6.6 19.9l1-5.8-4.3-4.2L9.2 9 12 3.5Z" />
  </svg>
);

export default function OfferRatingPage() {
  const params = useParams();
  const { t } = useI18n();
  const currentUser = getUser();
  const [offer, setOffer] = useState(null);
  const [rates, setRates] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const loadRatings = async () => {
    setStatus("loading");
    setError("");
    try {
      const payload = await apiRequest(`users/rates?offer_id=${params.id}`);
      const nextOffer = payload?.offer || null;
      const nextRates = payload?.rates || [];
      setOffer(nextOffer);
      setRates(nextRates);
      const existingRate = nextRates.find(
        (item) => item?.user?.id === currentUser?.id
      );
      setRatingValue(
        existingRate?.rating ??
          nextOffer?.auth_user_rating ??
          0
      );
      setComment(existingRate?.comment ?? "");
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err?.message || t("general.error_has_occurred"));
    }
  };

  useEffect(() => {
    if (!params?.id) return;
    loadRatings();
  }, [params?.id]);

  const isOwner = currentUser?.id === offer?.owner?.id;
  const isClosed = Boolean(offer?.is_closed) || offer?.status === "closed";
  const canRate = Boolean(offer && isClosed && !isOwner);
  const existingRating = useMemo(
    () => rates.find((item) => item?.user?.id === currentUser?.id),
    [rates, currentUser?.id]
  );
  const hasRated = Boolean(existingRating?.rating || offer?.auth_user_rating);
  const offerLink = offer
    ? offer?.owner?.id === currentUser?.id
      ? `/app/auth/my-offers/${offer.id}`
      : `/app/auth/offers/${offer.id}`
    : "";

  const handleSubmit = async () => {
    if (!canRate || !ratingValue) return;
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("users/rates", {
        method: "POST",
        body: {
          rating: ratingValue,
          comment: comment.trim() || null,
          offer_id: Number(params.id)
        }
      });
      await loadRatings();
    } catch (err) {
      setError(err?.message || t("general.error_has_occurred"));
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="h-32 animate-pulse rounded-2xl bg-neutral-100" />;
  }

  if (status === "error") {
    return <p className="text-sm text-danger-600">{error}</p>;
  }

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-900">
          {t("Rate this experience")}
        </h1>
        {offer ? (
          <Link
            href={offerLink}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#EADAF1] bg-white px-4 py-2 text-sm font-semibold text-primary-700"
          >
            {offer.title}
          </Link>
        ) : null}
      </div>

      {offer ? (
        <div className="rounded-3xl border border-[#EADAF1] bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-500">
                {t("Organizer")}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <UserAvatar user={offer.owner} size={56} withBorder />
                <div>
                  <p className="text-sm font-semibold text-primary-900">
                    {offer.owner?.first_name} {offer.owner?.last_name}
                  </p>
                  <p className="text-xs text-secondary-400">
                    {offer.owner?.age
                      ? t("years_old", { count: offer.owner.age })
                      : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-[#F7F1FA] px-4 py-3 text-sm text-secondary-600">
              {offer.city?.name || "-"}{" "}
              {offer.start_date ? `${t("Start date")} ${offer.start_date}` : ""}
            </div>
          </div>
        </div>
      ) : null}

      {canRate ? (
        <div className="rounded-3xl border border-[#EADAF1] bg-white p-5">
          <p className="text-sm font-semibold text-primary-900">
            {hasRated
              ? t("Update your rating: {{rating}}/5", { rating: ratingValue })
              : t("Rate your experience with")}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={`star-${value}`}
                type="button"
                onClick={() => setRatingValue(value)}
                className={`rounded-full p-1 transition ${
                  ratingValue >= value ? "bg-primary-600/10" : "bg-transparent"
                }`}
                aria-label={`${value} ${t("ratings")}`}
              >
                <StarIcon filled={ratingValue >= value} />
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-500">
              {t("Leave a comment")}
            </label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-[#EADAF1] px-4 py-3 text-sm text-secondary-500 outline-none focus:border-primary-500"
              placeholder={t("Type a message")}
            />
          </div>

          {error ? (
            <p className="mt-3 text-xs text-danger-600">{error}</p>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              label={t("Close")}
              className="w-full"
              onClick={() => window.history.back()}
            />
            <Button
              label={hasRated ? t("Update") : t("Submit")}
              className="w-full"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!ratingValue || isSubmitting}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-secondary-400">
          {isOwner ? t("rating_owner_notice") : t("rating_unavailable")}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-primary-800">
          {t("ratings")}
        </h2>
        {rates.length === 0 ? (
          <p className="text-sm text-secondary-400">
            {t("No one has rate this offer yet")}
          </p>
        ) : (
          <div className="space-y-3">
            {rates.map((rate, index) => (
              <div
                key={`${rate?.user?.id ?? "rate"}-${index}`}
                className="rounded-2xl border border-[#EADAF1] bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={rate.user} size={48} withBorder />
                    <div>
                      <p className="text-sm font-semibold text-primary-900">
                        {rate?.user?.first_name} {rate?.user?.last_name}
                      </p>
                      <p className="text-xs text-secondary-400">
                        {rate?.user?.age
                          ? t("years_old", { count: rate.user.age })
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <StarIcon
                        key={`rate-${index}-${value}`}
                        filled={value <= rate.rating}
                      />
                    ))}
                  </div>
                </div>
                {rate?.comment ? (
                  <p className="mt-3 text-sm text-secondary-500">
                    {rate.comment}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
