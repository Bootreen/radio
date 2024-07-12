import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useRadioStore = create(
  immer((set) => ({
    // { token_type, access_token, expires_in }
    tokenData: {},
    playlistLength: 0,
    playlist: {},
    isAuthorized: false,
    isLoaded: false,

    actions: {
      setToken: (token) =>
        set((state) => {
          state.tokenData = token;
        }),
      setIsAuthorized: (condition) =>
        set((state) => {
          state.isAuthorized = condition;
        }),
      setIsLoaded: (condition) =>
        set((state) => {
          state.isLoaded = condition;
        }),
      setPlaylistLength: (value) =>
        set((state) => {
          state.playlistLength = value;
        }),
      setPlaylist: (payload) =>
        set((state) => {
          state.playlist = payload;
        }),
    },
  }))
);

export const useRadioActions = () => useRadioStore((state) => state.actions);
