"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Button from "../../../../../components/ui/button";
import { ArrowLeftIcon, PaperAirplaneIcon } from "../../../../../components/ui/heroicons";
import { useI18n } from "../../../../../components/i18n-provider";
import { apiRequest } from "../../../../lib/api-client";
import { getUser } from "../../../../lib/session";

const formatDay = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric"
  });
};

const formatTime = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [sendState, setSendState] = useState("idle");
  const [sendError, setSendError] = useState("");
  const [conversation, setConversation] = useState(null);
  const currentUser = getUser();
  const bottomRef = useRef(null);
  const firstScrollRef = useRef(true);
  const messagesRef = useRef([]);
  const lastRemoteSignatureRef = useRef("");
  const lastConversationStampRef = useRef("");
  const dateLocale =
    locale === "fr" ? "fr-FR" : locale === "ar" ? "ar-MA" : "en-US";

  const buildMessageSignature = (items) => {
    if (!items || items.length === 0) return "empty";
    const first = items[0];
    const last = items[items.length - 1];
    return `${items.length}:${first?.id || ""}:${last?.id || ""}:${
      last?.created_at || ""
    }`;
  };

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const fetchMessages = async () => {
    setStatus("loading");
    try {
      const payload = await apiRequest(
        `conversations/${params.id}/messages`,
        { cache: false }
      );
      const remoteMessages = payload?.data || [];
      const conversationData = payload?.meta?.conversation || null;
      lastRemoteSignatureRef.current = buildMessageSignature(remoteMessages);
      lastConversationStampRef.current =
        conversationData?.last_message_at || "";
      setMessages(remoteMessages);
      setConversation(conversationData);
      setError("");
      setStatus("ready");
    } catch (err) {
      setError(err?.message || t("general.error_has_occurred"));
      setStatus("error");
    }
  };

  const refreshMessages = async () => {
    try {
      const payload = await apiRequest(
        `conversations/${params.id}/messages`,
        { cache: false }
      );
      const remoteMessages = payload?.data || [];
      const conversationData = payload?.meta?.conversation || null;
      const remoteSignature = buildMessageSignature(remoteMessages);
      const conversationStamp = conversationData?.last_message_at || "";
      const hasTempMessages = messagesRef.current.some(
        (message) => message?.isTemp
      );

      if (
        !hasTempMessages &&
        remoteSignature === lastRemoteSignatureRef.current
      ) {
        if (
          conversationStamp &&
          conversationStamp !== lastConversationStampRef.current
        ) {
          setConversation(conversationData);
          lastConversationStampRef.current = conversationStamp;
        }
        setStatus((prev) => (prev === "error" ? "ready" : prev));
        return;
      }

      setConversation(conversationData);
      setMessages((prev) => {
        const tempMessages = prev.filter((message) => message?.isTemp);
        if (!tempMessages.length) return remoteMessages;
        const filteredTemps = tempMessages.filter((temp) => {
          return !remoteMessages.some((remote) => {
            if (remote?.automatic) return false;
            if (remote?.user?.id !== temp?.user?.id) return false;
            if (remote?.content !== temp?.content) return false;
            const tempTime = new Date(temp.created_at).getTime();
            const remoteTime = new Date(remote.created_at).getTime();
            return Math.abs(remoteTime - tempTime) < 15000;
          });
        });
        return [...remoteMessages, ...filteredTemps];
      });
      lastRemoteSignatureRef.current = remoteSignature;
      lastConversationStampRef.current = conversationStamp;
      setError("");
      setStatus((prev) => (prev === "error" ? "ready" : prev));
    } catch {
      // Silent refresh; keep current UI state.
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [params.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMessages();
    }, 6000);

    return () => clearInterval(interval);
  }, [params.id]);

  const offer = conversation?.offer;
  const offerHref = offer
    ? offer.owner?.id === currentUser?.id
      ? `/app/auth/my-offers/${offer.id}`
      : `/app/auth/offers/${offer.id}`
    : "";

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [messages]);

  useEffect(() => {
    if (!bottomRef.current) return;
    const behavior = firstScrollRef.current ? "auto" : "smooth";
    bottomRef.current.scrollIntoView({ behavior, block: "end" });
    firstScrollRef.current = false;
  }, [sortedMessages.length]);

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sendState !== "idle") return;
    setSendState("sending");
    setSendError("");
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      content: trimmed,
      created_at: new Date().toISOString(),
      automatic: false,
      isTemp: true,
      user: {
        id: currentUser?.id || tempId,
        first_name: currentUser?.first_name || "You"
      }
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setContent("");
    try {
      const response = await apiRequest(`conversations/${params.id}/messages`, {
        method: "POST",
        body: { content: trimmed }
      });
      const newMessage = response?.data || null;
      setMessages((prev) =>
        prev.map((message) =>
          message.id === tempId
            ? newMessage || { ...message, isTemp: false }
            : message
        )
      );
    } catch (err) {
      setMessages((prev) => prev.filter((message) => message.id !== tempId));
      setSendError(err?.message || t("general.error_has_occurred"));
    } finally {
      setSendState("idle");
    }
  };

  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col gap-4 overflow-hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EADAF1] text-secondary-600 transition hover:bg-[#F7F1FA]"
          aria-label={t("Close")}
        >
          <ArrowLeftIcon size={20} className="text-secondary-600" />
        </button>
        {offer && offerHref ? (
          <Link
            href={offerHref}
            className="flex-1 truncate rounded-full bg-[#F7F1FA] px-4 py-2 text-sm font-semibold text-primary-700"
          >
            {offer.title}
          </Link>
        ) : (
          <p className="text-sm font-semibold text-primary-900">
            {t("Groops")}
          </p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-3xl border border-[#EADAF1] bg-white p-4">
        <div className="flex-1 overflow-y-auto pr-2">
          {status === "loading" ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`message-skeleton-${index}`}
                  className="h-16 animate-pulse rounded-2xl bg-neutral-100"
                />
              ))}
            </div>
          ) : null}

          {status === "error" ? (
            <p className="text-sm text-danger-600">{error}</p>
          ) : null}

          {status === "ready" && sortedMessages.length === 0 ? (
            <p className="text-sm text-secondary-400">{t("nothingToShow")}</p>
          ) : null}

          {status === "ready" && sortedMessages.length > 0 ? (
            <div className="space-y-4">
              {(() => {
                let lastDate = "";
                return sortedMessages.map((message) => {
                  const dateKey = message?.created_at?.split("T")[0] || "";
                  const showDate = dateKey && dateKey !== lastDate;
                  if (showDate) {
                    lastDate = dateKey;
                  }
                  const isMine = message?.user?.id === currentUser?.id;
                  const isTemp = Boolean(message?.isTemp);
                  if (message?.automatic) {
                    return (
                      <div key={message.id} className="space-y-2">
                        {showDate ? (
                          <div className="flex justify-center">
                            <span className="rounded-full bg-[#F7F1FA] px-3 py-1 text-xs text-secondary-500">
                              {formatDay(message.created_at, dateLocale)}
                            </span>
                          </div>
                        ) : null}
                        <div className="flex justify-center">
                          <span className="text-xs text-secondary-400">
                            {message.content}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={message.id} className="space-y-2">
                      {showDate ? (
                        <div className="flex justify-center">
                            <span className="rounded-full bg-[#F7F1FA] px-3 py-1 text-xs text-secondary-500">
                              {formatDay(message.created_at, dateLocale)}
                            </span>
                          </div>
                        ) : null}
                      <div
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            isMine
                              ? "bg-[#EADAF1] text-primary-900"
                              : "bg-[#F4F4F5] text-secondary-700"
                          } ${isTemp ? "opacity-70" : ""}`}
                        >
                          {!isMine ? (
                            <p className="text-xs font-semibold text-primary-900">
                              {message?.user?.first_name || ""}
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm leading-relaxed">
                            {message.content}
                          </p>
                          <p className="mt-2 text-[11px] text-secondary-400">
                            {isTemp
                              ? t("Loading more...")
                              : formatTime(message.created_at, dateLocale)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
              <div ref={bottomRef} />
            </div>
          ) : null}
        </div>
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 rounded-full border border-[#EADAF1] bg-white px-3 py-2"
      >
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={t("Type a message")}
          className="w-full bg-transparent px-2 py-2 text-base text-secondary-600 outline-none"
        />
        <button
          type="submit"
          disabled={sendState === "sending" || content.trim().length === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 via-[#822485] to-secondary-500 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={t("Submit")}
        >
          {sendState === "sending" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
          ) : (
            <PaperAirplaneIcon size={18} className="text-white" />
          )}
        </button>
      </form>
      {sendError ? (
        <p className="text-xs text-danger-600">{sendError}</p>
      ) : null}
    </div>
  );
}
