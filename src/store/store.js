import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useRadioStore = create(
  immer((set) => ({
    // { token_type, access_token, expires_in }
    tokenData: {},

    actions: {
      setToken: (token) =>
        set((state) => {
          state.token = token;
        }),
    },
  }))
);

export const useRadioActions = () => useRadioStore((state) => state.actions);
