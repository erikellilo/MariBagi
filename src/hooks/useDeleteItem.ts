import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "@/api/itemApi";
import { queryKeys } from "./queryKeys";

export const useDeleteItem = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemApi.delete(bagiId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
