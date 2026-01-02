"use client";

import { useEffect, useState } from "react";

const isDateLikeType = (type) => type === "date" || type === "time";

const isIOSWebView = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isWebKit = /AppleWebKit/i.test(ua);
  const isSafari =
    /Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|GSA|Instagram|FBAN|FBAV/i.test(ua);
  return isIOS && isWebKit && !isSafari;
};

const resolveInputType = (type) => {
  if (!isDateLikeType(type)) return type;
  if (typeof document === "undefined") return type;
  if (isIOSWebView()) return "text";

  const probe = document.createElement("input");
  probe.setAttribute("type", type);
  if (probe.type !== type) return "text";
  if (type === "date") {
    probe.value = "2000-01-01";
    return probe.value === "2000-01-01" ? type : "text";
  }
  if (type === "time") {
    probe.value = "23:59";
    return probe.value === "23:59" ? type : "text";
  }
  return type;
};

const getFallbackMeta = (type) => {
  if (type === "date") {
    return {
      placeholder: "YYYY-MM-DD",
      pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}"
    };
  }
  if (type === "time") {
    return {
      placeholder: "HH:MM",
      pattern: "[0-9]{2}:[0-9]{2}"
    };
  }
  return {
    placeholder: undefined,
    pattern: undefined
  };
};

const useSupportedInputType = (type) => {
  const [resolvedType, setResolvedType] = useState(type);

  useEffect(() => {
    setResolvedType(resolveInputType(type));
  }, [type]);

  return resolvedType;
};

export { getFallbackMeta, isDateLikeType, resolveInputType };

export default useSupportedInputType;
