import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json({ error: "A video URL is required." }, { status: 400 });
    }

    const apiUrl = process.env.VIDEO_DOWNLOADER_API_URL || "https://api.cobalt.tools";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return NextResponse.json(
        { error: data.error?.code || data.text || "The video could not be processed." },
        { status: 422 },
      );
    }

    if (typeof data.url === "string") {
      return NextResponse.json({ downloads: [{ url: data.url, label: data.filename || "Video" }] });
    }

    if (Array.isArray(data.picker) && data.picker.length) {
      return NextResponse.json({
        title: "Select a download",
        downloads: data.picker
          .filter((item) => typeof item.url === "string")
          .map((item, index) => ({ url: item.url, label: item.type || `Option ${index + 1}` })),
      });
    }

    return NextResponse.json({ error: "No downloadable media was returned." }, { status: 422 });
  } catch {
    return NextResponse.json(
      { error: "The video downloader service is unavailable. Try again later." },
      { status: 503 },
    );
  }
}
