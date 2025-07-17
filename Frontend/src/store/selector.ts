import { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S): S => {
  type StateType = ReturnType<S["getState"]>;

  const store = _store as WithSelectors<typeof _store>;
  store.use = {} as { [K in keyof StateType]: () => StateType[K] };

  for (const k of Object.keys(store.getState())) {
    const key = k as keyof StateType;
    (store.use as Record<keyof StateType, () => StateType[keyof StateType]>)[key] = (): StateType[typeof key] =>
      store(s => (s as StateType)[key]);
  }
  return store;
};
export default createSelectors;
