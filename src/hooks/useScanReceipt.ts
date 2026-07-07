import { useMutation } from "@tanstack/react-query";
import { scanApi } from "@/api/scanApi";

export const useScanReceipt = (bagiId: string) => {
  return useMutation({
    mutationFn: () => scanApi.scan(bagiId),
  });
};
