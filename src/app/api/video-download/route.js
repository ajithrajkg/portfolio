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
    const apiKey = process.env.VIDEO_DOWNLOADER_API_KEY;
    const authScheme = process.env.VIDEO_DOWNLOADER_AUTH_SCHEME || "Api-Key";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `${authScheme} ${apiKey}` } : {}),
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();

    if (!response.ok || data.status === "error") {
      const serviceCode = data.error?.code;
      if (serviceCode === "api.auth.jwt.missing" && !apiKey) {
        return NextResponse.json(
          { error: "The downloader API requires authentication. Add VIDEO_DOWNLOADER_API_KEY to the environment." },
          { status: 503 },
        );
      }
      if (typeof serviceCode === "string" && serviceCode.startsWith("api.auth")) {
        return NextResponse.json(
          { error: "The downloader API rejected the configured authentication. Check the API key and VIDEO_DOWNLOADER_AUTH_SCHEME." },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: serviceCode || data.text || "The video could not be processed." },
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
