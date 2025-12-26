"use client";

import React, { useEffect, useRef } from "react";

import qrcode from "./qr-generator";

const normalizeFraction = (value, fallback) => {
  if (typeof value !== "number") return fallback;
  if (Number.isNaN(value)) return fallback;
  if (value < 0) return 0;
  if (value > 0.6) return 0.6;
  return value;
};

const normalizeNumber = (value, fallback) => {
  if (typeof value !== "number") return fallback;
  if (Number.isNaN(value)) return fallback;
  return value;
};

const normalizeGradientStops = (value) => {
  if (!Array.isArray(value) || value.length === 0) return null;
  if (typeof value[0] === "string") {
    const steps = value.length - 1 || 1;
    return value.map((color, index) => ({
      color,
      offset: index / steps
    }));
  }
  return value
    .filter((stop) => stop && typeof stop.color === "string")
    .map((stop) => ({
      color: stop.color,
      offset:
        typeof stop.offset === "number" && !Number.isNaN(stop.offset)
          ? stop.offset
          : 0
    }))
    .sort((a, b) => a.offset - b.offset);
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const safeRadius = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
};

const getQrMatrix = (value, ecc) => {
  const qr = qrcode(0, ecc || "H");
  qr.addData(value);
  qr.make();
  return qr;
};

export const drawQrToCanvas = (
  ctx,
  value,
  {
    x = 0,
    y = 0,
    size = 200,
    margin = 12,
    color = "#B12587",
    backgroundColor = "#ffffff",
    gradientColors = null,
    ecc = "H",
    clearCenterFraction = 0.26,
    clearCenterRadius = null
  } = {}
) => {
  if (!ctx || !value) return;

  const qr = getQrMatrix(value, ecc);
  const modules = qr.getModuleCount();
  const safeSize = Math.max(64, Math.floor(size));
  const marginPx = Math.max(0, Math.floor(normalizeNumber(margin, 12)));
  const cellSize = Math.max(
    1,
    Math.floor((safeSize - marginPx * 2) / modules)
  );
  const qrSize = cellSize * modules;
  const offset = Math.floor((safeSize - qrSize) / 2);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x, y, safeSize, safeSize);

  const gradientStops = normalizeGradientStops(gradientColors);
  if (gradientStops && gradientStops.length > 0) {
    const gradient = ctx.createLinearGradient(
      x + offset,
      y + offset,
      x + offset + qrSize,
      y + offset + qrSize
    );
    gradientStops.forEach((stop) => {
      gradient.addColorStop(
        Math.min(1, Math.max(0, stop.offset)),
        stop.color
      );
    });
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = color;
  }
  for (let row = 0; row < modules; row += 1) {
    for (let col = 0; col < modules; col += 1) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(
          x + offset + col * cellSize,
          y + offset + row * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }

  const centerFraction = normalizeFraction(clearCenterFraction, 0);
  let clearRect = null;
  if (centerFraction > 0) {
    const clearModules = Math.max(2, Math.floor(modules * centerFraction));
    const clearSize = clearModules * cellSize;
    const clearX = x + offset + Math.floor((qrSize - clearSize) / 2);
    const clearY = y + offset + Math.floor((qrSize - clearSize) / 2);
    ctx.fillStyle = backgroundColor;
    const radius = normalizeNumber(
      clearCenterRadius,
      Math.round(clearSize * 0.2)
    );
    drawRoundedRect(ctx, clearX, clearY, clearSize, clearSize, radius);
    ctx.fill();
    clearRect = { x: clearX, y: clearY, size: clearSize, radius };
  }
  return clearRect;
};

export default function QrCodeCanvas({
  value,
  size = 208,
  margin = 12,
  color = "#B12587",
  backgroundColor = "#ffffff",
  gradientColors = null,
  ecc = "H",
  clearCenterFraction = 0.26,
  clearCenterRadius = null,
  className = ""
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawQrToCanvas(ctx, value, {
      size,
      margin,
      color,
      backgroundColor,
      gradientColors,
      ecc,
      clearCenterFraction,
      clearCenterRadius
    });
  }, [
    value,
    size,
    margin,
    color,
    backgroundColor,
    gradientColors,
    ecc,
    clearCenterFraction,
    clearCenterRadius
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="QR code"
    />
  );
}
