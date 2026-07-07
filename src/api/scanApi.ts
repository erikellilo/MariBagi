import { apiPost } from "./client";
import type { ScanResponse } from "@/types/api";

export const scanApi = {
  scan: (bagiId: string): Promise<ScanResponse> =>
    apiPost(`/api/bagi/${bagiId}/scan`, {}),
};
