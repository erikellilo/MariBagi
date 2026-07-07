import { apiPost, apiPatch, apiDelete } from "./client";
import type { Userbagi } from "@/types/entities";
import type { CreateUserbagiRequest, UpdateUserbagiRequest } from "@/types/api";

export const userbagiApi = {
  create: (bagiId: string, body: CreateUserbagiRequest): Promise<Userbagi> =>
    apiPost(`/api/bagi/${bagiId}/userbagi`, body),

  update: (bagiId: string, id: string, body: UpdateUserbagiRequest): Promise<Userbagi> =>
    apiPatch(`/api/bagi/${bagiId}/userbagi/${id}`, body),

  delete: (bagiId: string, id: string): Promise<void> =>
    apiDelete(`/api/bagi/${bagiId}/userbagi/${id}`),
};
