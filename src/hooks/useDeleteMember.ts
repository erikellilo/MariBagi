import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userbagiApi } from "@/api/userbagiApi";
import { queryKeys } from "./queryKeys";

export const useDeleteMember = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userbagiApi.delete(bagiId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
