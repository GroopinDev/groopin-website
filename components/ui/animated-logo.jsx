"use client";

import React from "react";
import Image from "next/image";

export default function AnimatedLogo({ width = 120, height = 40 }) {
  return (
    <div className="logo-bounce">
      <Image
        src="/assets/images/groopin-header.png"
        alt="Groopin"
        width={width}
        height={height}
        priority
        style={{ height: "auto", width: "auto" }}
      />
    </div>
  );
}
