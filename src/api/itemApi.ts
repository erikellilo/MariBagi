import { apiPost, apiPatch, apiDelete } from "./client";
import type { Item } from "@/types/entities";
import type { CreateItemRequest, UpdateItemRequest, BatchCreateItemsRequest } from "@/types/api";

export const itemApi = {
  create: (bagiId: string, body: CreateItemRequest): Promise<Item> =>
    apiPost(`/api/bagi/${bagiId}/item`, body),

  batchCreate: (bagiId: string, body: BatchCreateItemsRequest): Promise<Item[]> =>
    apiPost(`/api/bagi/${bagiId}/item/batch`, body),

  update: (bagiId: string, id: string, body: UpdateItemRequest): Promise<Item> =>
    apiPatch(`/api/bagi/${bagiId}/item/${id}`, body),

  delete: (bagiId: string, id: string): Promise<void> =>
    apiDelete(`/api/bagi/${bagiId}/item/${id}`),
};
