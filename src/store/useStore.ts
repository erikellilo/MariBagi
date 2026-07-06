import { create } from "zustand";
import { createBagiSlice, BagiSlice } from "./storeSliceBagi";
import createSelectors from "./selector";

type StoreState = BagiSlice;

// In store.ts
export const useStore = create<StoreState>()((...a) => ({
  ...createBagiSlice(...a),
}));

export default createSelectors(useStore);
