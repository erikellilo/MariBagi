import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userbagiApi } from "@/api/userbagiApi";
import type { UpdateUserbagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useUpdateMember = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserbagiRequest }) =>
      userbagiApi.update(bagiId, id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
