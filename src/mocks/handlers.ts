import { http, HttpResponse } from "msw";
import { db, delay, seedDb } from "./db";
import type { BagiDetail, BagiListItem } from "@/types/entities";
import type { BatchCreateItemsRequest, CreateBagiRequest, CreateItemRequest, CreateUserbagiRequest, UpdateBagiRequest, UpdateItemRequest, UpdateUserbagiRequest } from "@/types/api";
import { v4 as uuid } from "uuid";
import { scanFixture } from "./fixtures";

const API_BASE = "/api";

seedDb();

export const handlers = [
  http.get(`${API_BASE}/bagi`, async () => {
    await delay();


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


    const body = (await request.json()) as CreateBagiRequest;
    const now = Date.now();
    const id = uuid();

    const bagi = {
      id,
      name: body.name,
      date: now,
      createdAt: now,
    };

    db.bagi.set(id, bagi);
    return HttpResponse.json(bagi, { status: 201 });
  }),

  http.patch(`${API_BASE}/bagi/:bagiId`, async ({ params, request }) => {
    await delay();


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

  http.post(`${API_BASE}/bagi/:bagiId/userbagi`, async ({ params, request }) => {
    await delay();


    const { bagiId } = params;
    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateUserbagiRequest;
    const now = Date.now();
    const id = uuid();

    const member = {
      id,
      bagiId: bagiId as string,
      name: body.name,
      createdAt: now,
    };

    db.userbagi.set(id, member);
    return HttpResponse.json(member, { status: 201 });
  }),

  http.patch(`${API_BASE}/bagi/:bagiId/userbagi/:id`, async ({ params, request }) => {
    await delay();


    const { id } = params;
    const member = db.userbagi.get(id as string);

    if (!member) {
      return HttpResponse.json({ message: "Member not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateUserbagiRequest;
    const updated = { ...member, name: body.name };
    db.userbagi.set(id as string, updated);

    return HttpResponse.json(updated);
  }),

  http.delete(`${API_BASE}/bagi/:bagiId/userbagi/:id`, async ({ params }) => {
    await delay();


    const { id } = params;
    if (!db.userbagi.has(id as string)) {
      return HttpResponse.json({ message: "Member not found" }, { status: 404 });
    }

    db.userbagi.delete(id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE}/bagi/:bagiId/item`, async ({ params, request }) => {
    await delay();


    const { bagiId } = params;
    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateItemRequest;
    const now = Date.now();
    const id = uuid();

    const item = {
      id,
      bagiId: bagiId as string,
      name: body.name,
      amount: body.amount,
      quantity: body.quantity,
      paidBy: body.paidBy,
      includeService: body.includeService,
      includeTax: body.includeTax,
      allocation: body.allocation,
      createdAt: now,
    };

    db.item.set(id, item);
    return HttpResponse.json(item, { status: 201 });
  }),

  http.post(`${API_BASE}/bagi/:bagiId/item/batch`, async ({ params, request }) => {
    await delay();


    const { bagiId } = params;
    if (!db.bagi.has(bagiId as string)) {
      return HttpResponse.json({ message: "Bagi not found" }, { status: 404 });
    }

    const body = (await request.json()) as BatchCreateItemsRequest;
    const now = Date.now();
    const created = body.items.map((itemInput) => {
      const id = uuid();
      const item = {
        id,
        bagiId: bagiId as string,
        name: itemInput.name,
        amount: itemInput.amount,
        quantity: itemInput.quantity,
        paidBy: "",
        includeService: false,
        includeTax: false,
        allocation: [],
        createdAt: now,
      };
      db.item.set(id, item);
      return item;
    });

    return HttpResponse.json(created, { status: 201 });
  }),

  http.patch(`${API_BASE}/bagi/:bagiId/item/:id`, async ({ params, request }) => {
    await delay();


    const { id } = params;
    const item = db.item.get(id as string);

    if (!item) {
      return HttpResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateItemRequest;
    const updated = { ...item, ...body };
    db.item.set(id as string, updated);

    return HttpResponse.json(updated);
  }),

  http.delete(`${API_BASE}/bagi/:bagiId/item/:id`, async ({ params }) => {
    await delay();


    const { id } = params;
    if (!db.item.has(id as string)) {
      return HttpResponse.json({ message: "Item not found" }, { status: 404 });
    }

    db.item.delete(id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_BASE}/bagi/:bagiId/scan`, async () => {
    await delay(800);

    return HttpResponse.json(scanFixture);
  }),
];
