import { NextResponse } from "next/server";

const isAllowedUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url || !isAllowedUrl(url)) {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      return new NextResponse("Failed to fetch image", {
        status: response.status
      });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const headers = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400"
    };

    return new NextResponse(response.body, { status: 200, headers });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
