import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import type { UpdateItemRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useUpdateItem = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateItemRequest }) =>
      itemApi.update(bagiId, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
