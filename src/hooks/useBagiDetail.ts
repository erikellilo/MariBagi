import { useQuery } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import { queryKeys } from "./queryKeys";

export const useBagiDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bagi.detail(id),
    queryFn: () => bagiApi.detail(id),
    enabled: !!id,
  });
};
