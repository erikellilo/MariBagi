import { v4 as uuid } from "uuid";
import type { Bagi, Item, Userbagi } from "@/types/entities";

interface DB {
  bagi: Map<string, Bagi>;
  userbagi: Map<string, Userbagi>;
  item: Map<string, Item>;
}

export const db: DB = {
  bagi: new Map(),
  userbagi: new Map(),
  item: new Map(),
};

export const delay = (ms: number = 200): Promise<void> => {
  const jitter = ms + Math.random() * 200;
  return new Promise((resolve) => setTimeout(resolve, jitter));
};

export const maybeFail = (failRate: number = 0): never | void => {
  if (Math.random() < failRate) {
    throw new HttpResponseError(500, "Simulated server error");
  }
};

export class HttpResponseError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpResponseError";
    this.status = status;
  }
}

export const seedDb = (): void => {
  const bagiId = uuid();
  const now = Date.now();

  db.bagi.set(bagiId, {
    id: bagiId,
    name: "Tiket Dufan",
    date: now,
    createdAt: now,
  });

  const asepId = uuid();
  const ucupId = uuid();
  db.userbagi.set(asepId, { id: asepId, bagiId, name: "asep", createdAt: now });
  db.userbagi.set(ucupId, { id: ucupId, bagiId, name: "ucup", createdAt: now });

  const itemId = uuid();
  db.item.set(itemId, {
    id: itemId,
    bagiId,
    name: "Hotel",
    amount: 400000,
    quantity: 1,
    paidBy: asepId,
    includeService: false,
    includeTax: false,
    allocation: [
      { memberId: asepId, quantity: 1 },
      { memberId: ucupId, quantity: 1 },
    ],
    createdAt: now,
  });
};
