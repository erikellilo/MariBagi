import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type { Bagi, BagiDetail, BagiListItem } from "@/types/entities";
import type { CreateBagiRequest, UpdateBagiRequest } from "@/types/api";

const BASE = "/api/bagi";

export const bagiApi = {
  list: (): Promise<BagiListItem[]> => apiGet(BASE),

  detail: (id: string): Promise<BagiDetail> => apiGet(`${BASE}/${id}`),

  create: (body: CreateBagiRequest): Promise<Bagi> => apiPost(BASE, body),

  update: (id: string, body: UpdateBagiRequest): Promise<Bagi> =>
    apiPatch(`${BASE}/${id}`, body),

  delete: (id: string): Promise<void> => apiDelete(`${BASE}/${id}`),
};
