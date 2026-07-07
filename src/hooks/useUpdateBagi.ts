import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import type { UpdateBagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useUpdateBagi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBagiRequest }) =>
      bagiApi.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(id) });
    },
  });
};
