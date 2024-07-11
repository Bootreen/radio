import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useRadioStore = create(
  immer((set) => ({
    dummyVar: null,

    actions: {
      dummyAction: () =>
        set((state) => {
          state;
        }),
    },
  }))
);

export const useRadioActions = () => useRadioStore((state) => state.actions);
