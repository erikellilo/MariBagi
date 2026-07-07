import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import type { CreateItemRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useCreateItem = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateItemRequest) => itemApi.create(bagiId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
