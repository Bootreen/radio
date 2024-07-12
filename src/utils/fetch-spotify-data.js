import axios from "axios";
import { SPOTIFY_PATHS, PLAYLIST_ID } from "../store/constants";

const { API_URL, PLAYLISTS_PREF, TRACKS_POSTF } = SPOTIFY_PATHS;
const targetUrl = API_URL + PLAYLISTS_PREF + PLAYLIST_ID + TRACKS_POSTF;

export const fetchPlaylistLength = async (accessToken) =>
  await axios.get(targetUrl, {
    params: {
      market: "DE",
      fields: "total",
      limit: "1",
      offset: "0",
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

export const fetchPlaylistItems = async (accessToken, limit, offset) =>
  await axios.get(targetUrl, {
    params: {
      market: "DE",
      fields: "items(track(name, uri, album(name, id), artists(name))",
      limit: limit,
      offset: offset,
    },
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
