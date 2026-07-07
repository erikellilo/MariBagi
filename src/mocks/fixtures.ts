import type { ScanResponse } from "@/types/api";

export const scanFixture: ScanResponse = {
  bagi: {
    name: "Restoran Padang",
    date: Date.now(),
    includeTax: true,
    includeService: true,
  },
  items: [
    { name: "Nasi Rendang", amount: 45000, quantity: 2 },
    { name: "Ayam Pop", amount: 40000, quantity: 1 },
    { name: "Es Teh", amount: 8000, quantity: 3 },
    { name: "Nasi Putih", amount: 5000, quantity: 3 },
  ],
};
