import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import type { BatchCreateItemsRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useBatchCreateItems = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: BatchCreateItemsRequest) => itemApi.batchCreate(bagiId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
