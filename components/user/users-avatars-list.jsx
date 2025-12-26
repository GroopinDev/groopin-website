"use client";

import React from "react";

export default function UsersAvatarsList({ users = [], lastItemText }) {
  const visible = users.slice(0, 3);
  return (
    <div className="flex items-center">
      {visible.map((user, index) => (
        <div
          key={user.id || index}
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-xs font-semibold text-white"
          style={{ marginLeft: index === 0 ? 0 : -8 }}
        >
          {user.first_name?.[0] || "G"}
        </div>
      ))}
      {lastItemText ? (
        <div className="ml-2 rounded-full border border-[#EADAF1] px-2 py-1 text-xs text-secondary-400">
          {lastItemText}
        </div>
      ) : null}
    </div>
  );
}
