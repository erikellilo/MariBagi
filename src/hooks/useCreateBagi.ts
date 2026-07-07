import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import type { CreateBagiRequest } from "@/types/api";
import { queryKeys } from "./queryKeys";

export const useCreateBagi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBagiRequest) => bagiApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bagi.lists() });
    },
  });
};
