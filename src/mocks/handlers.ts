import { http, HttpResponse } from "msw";
import { db, delay, maybeFail, seedDb } from "./db";
import type { BagiDetail, BagiListItem } from "@/types/entities";
import type { CreateBagiRequest, UpdateBagiRequest } from "@/types/api";
import { v4 as uuid } from "uuid";

const API_BASE = "/api";

seedDb();

export const handlers = [
  http.get(`${API_BASE}/bagi`, async () => {
    await delay();
    maybeFail(0.1);

    const list: BagiListItem[] = Array.from(db.bagi.values()).map((b) => ({
      id: b.id,
      name: b.name,
      date: b.date,
      memberCount: Array.from(db.userbagi.values()).filter((u) => u.bagiId === b.id).length,
      itemCount: Array.from(db.item.values()).filter((i) => i.bagiId === b.id).length,
    }));

    return HttpResponse.json(list);
  }),

  http.get(`${API_BASE}/bagi/:bagiId`, async ({ params }) => {
    await delay();
    maybeFail(0.1);

    const { bagiId } = params;
    const bagi = db.bagi.get(bagiId as string);

    if (!bagi) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const members = Array.from(db.userbagi.values()).filter((u) => u.bagiId === bagiId);
    const items = Array.from(db.item.values()).filter((i) => i.bagiId === bagiId);

    const detail: BagiDetail = { ...bagi, members, items };
    return HttpResponse.json(detail);
  }),

  http.post(`${API_BASE}/bagi`, async ({ request }) => {
    await delay();
    maybeFail(0.1);

    const body = (await request.json()) as CreateBagiRequest;
    const now = Date.now();
    const id = uuid();

    const bagi = {
      id,
      name: body.name,
      date: now,
      includeService: body.includeService,
      includeTax: body.includeTax,
      createdAt: now,
    };

    db.bagi.set(id, bagi);
    return HttpResponse.json(bagi, { status: 201 });
  }),

  http.patch(`${API_BASE}/bagi/:bagiId`, async ({ params, request }) => {
    await delay();
    maybeFail(0.1);

    const { bagiId } = params;
    const bagi = db.bagi.get(bagiId as string);

    if (!bagi) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateBagiRequest;
    const updated = { ...bagi, ...body };
    db.bagi.set(bagiId as string, updated);

    return HttpResponse.json(updated);
  }),

  http.delete(`${API_BASE}/bagi/:bagiId`, async ({ params }) => {
    await delay();
    maybeFail(0.1);

    const { bagiId } = params;

    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    for (const [id, u] of db.userbagi) {
      if (u.bagiId === bagiId) db.userbagi.delete(id);
    }
    for (const [id, i] of db.item) {
      if (i.bagiId === bagiId) db.item.delete(id);
    }
    db.bagi.delete(bagiId as string);

    return new HttpResponse(null, { status: 204 });
  }),
];
