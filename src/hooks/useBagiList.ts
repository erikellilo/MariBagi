import { useQuery } from "@tanstack/react-query";
import { bagiApi } from "@/api/bagiApi";
import { queryKeys } from "./queryKeys";

export const useBagiList = () => {
  return useQuery({
    queryKey: queryKeys.bagi.lists(),
    queryFn: bagiApi.list,
  });
};
