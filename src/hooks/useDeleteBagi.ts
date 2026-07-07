import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import { queryKeys } from "./queryKeys";

export const useDeleteBagi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bagiApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.lists() });
    },
  });
};
