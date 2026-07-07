export const queryKeys = {
  bagi: {
    all: ["bagi"] as const,
    lists: () => [...queryKeys.bagi.all, "list"] as const,
    detail: (id: string) => [...queryKeys.bagi.all, "detail", id] as const,
  },
};
