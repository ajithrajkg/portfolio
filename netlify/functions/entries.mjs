import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";

const store = getStore("e2m-entries");

export default async function entries(request) {
  try {
    if (request.method === "POST") {
      const body = await request.json();
      const english = typeof body.english === "string" ? body.english.trim().slice(0, 1000) : "";
      const malayalam = typeof body.malayalam === "string" ? body.malayalam.trim().slice(0, 1000) : "";

      if (!english) {
        return Response.json({ error: "English text is required." }, { status: 400 });
      }

      const entry = {
        id: randomUUID(),
        english,
        malayalam,
        createdAt: new Date().toISOString(),
      };
      await store.setJSON(entry.id, entry);
      return Response.json({ success: true, entry }, { status: 201 });
    }

    if (request.method === "GET") {
      const { blobs } = await store.list();
      const entries = await Promise.all(blobs.map(({ key }) => store.get(key, { type: "json" })));
      entries.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
      return Response.json(entries);
    }

    if (request.method === "DELETE") {
      const id = new URL(request.url).searchParams.get("id");
      if (!id) return Response.json({ error: "Entry ID is required." }, { status: 400 });
      await store.delete(id);
      return Response.json({ success: true });
    }

    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, POST, DELETE" },
    });
  } catch (error) {
    console.error("E2M entries function failed:", error);
    return Response.json({ error: "Could not access Netlify Blobs." }, { status: 500 });
  }
}