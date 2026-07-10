import type { ScanResponse } from "@/types/api";

export const scanFixture: ScanResponse = {
  bagi: {
    name: "Restoran Padang",
    date: Date.now(),
  },
  items: [
    { name: "Nasi Rendang", amount: 45000, quantity: 2, includeService: true, includeTax: true },
    { name: "Ayam Pop", amount: 40000, quantity: 1, includeService: true, includeTax: true },
    { name: "Es Teh", amount: 8000, quantity: 3, includeService: true, includeTax: true },
    { name: "Nasi Putih", amount: 5000, quantity: 3, includeService: true, includeTax: true },
  ],
};
