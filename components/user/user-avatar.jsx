"use client";

import React from "react";
import Image from "next/image";

const getBgColor = () => "#B12587";

export default function UserAvatar({ user, size = 60, withBorder = false }) {
  const isDefaultAvatar = user?.uses_default_image;
  const initials =
    (user?.first_name?.[0] || "U") + (user?.last_name?.[0] || "");

  if (isDefaultAvatar || !user?.avatar_image_url) {
    return (
      <div
        className={`flex items-center justify-center rounded-full text-white ${
          withBorder ? "border-2 border-[#A564C2]" : ""
        }`}
        style={{
          width: size,
          height: size,
          backgroundColor: getBgColor()
        }}
      >
        <span className="text-base font-semibold">{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-full ${
        withBorder ? "border-2 border-[#A564C2]" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <Image
        src={user.avatar_image_url}
        alt={user.name || "User avatar"}
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
