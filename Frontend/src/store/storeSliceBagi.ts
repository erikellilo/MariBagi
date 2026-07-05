import { StateCreator } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface BagiState {
  namaBagi: string;
  bagiId: string;
  bagiDate: Date | null;
  includeService: boolean;
  includeTax: boolean;
}
interface BagiActions {
  insertBagi: (bagi: Omit<BagiState, "bagiId">) => void;
  editBagi: (bago: BagiState) => void;
}

export type BagiSlice = BagiState & BagiActions;

export const createBagiSlice: StateCreator<BagiSlice> = set => ({
  namaBagi: "",
  bagiId: "",
  bagiDate: null,
  includeService: false,
  includeTax: false,
  insertBagi: (bagi): void =>
    set(() => ({
      ...bagi,
      bagiId: uuidv4().toString(),
    })),
  editBagi: (bagi: BagiState): void =>
    set(() => ({
      namaBagi: bagi.namaBagi,
      bagiDate: new Date(),
      includeService: bagi.includeService,
      includeTax: bagi.includeTax,
    })),
});
