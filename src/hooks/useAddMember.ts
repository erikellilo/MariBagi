import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userbagiApi } from "@/api/userbagiApi";
import type { CreateUserbagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useAddMember = (bagiId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateUserbagiRequest) => userbagiApi.create(bagiId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.detail(bagiId) });
    },
  });
};
