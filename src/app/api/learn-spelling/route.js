import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";

const STORE_NAME = "learn-spelling";
const ITEMS_KEY = "items";

export const runtime = "nodejs";

export async function GET() {
  try {
    const store = getStore(STORE_NAME);
    const items = await store.get(ITEMS_KEY, { type: "json" });
    return NextResponse.json({ items: Array.isArray(items) ? items : [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Netlify Blobs is unavailable. Run and deploy this app on Netlify to load saved text." },
      { status: 503 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim().slice(0, 1000) : "";

    if (!text) {
      return NextResponse.json({ error: "There is no text to save." }, { status: 400 });
    }

    const store = getStore(STORE_NAME);
    const existing = await store.get(ITEMS_KEY, { type: "json" });
    const items = Array.isArray(existing) ? existing : [];
    items.push({ text, createdAt: new Date().toISOString() });
    await store.setJSON(ITEMS_KEY, items.slice(-500));

    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Netlify Blobs is unavailable. Run and deploy this app on Netlify to save text." },
      { status: 503 },
    );
  }
}
