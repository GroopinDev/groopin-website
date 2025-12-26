import React from "react";

import AuthHeader from "../../../components/auth-header";

export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <AuthHeader />
      <div className="mx-auto w-full max-w-lg px-4 pb-10">{children}</div>
    </div>
  );
}
