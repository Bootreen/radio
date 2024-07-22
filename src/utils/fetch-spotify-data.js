import axios from "axios";
import { SPOTIFY_PATHS, PLAYLIST_ID, TOKEN_TYPE } from "../store/constants";

const { API_URL, PLAYLISTS_PREF, ARTISTS_PREF, FEATURES_PREF, TRACKS_POSTF } =
  SPOTIFY_PATHS;

const fetchPlaylistLength = async (accessToken) =>
  await axios.get(API_URL + PLAYLISTS_PREF + PLAYLIST_ID + TRACKS_POSTF, {
    params: {
      market: "DE",
      fields: "total",
      limit: "1",
      offset: "0",
    },
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const fetchPlaylistItems = async (accessToken, limit, offset) =>
  await axios.get(API_URL + PLAYLISTS_PREF + PLAYLIST_ID + TRACKS_POSTF, {
    params: {
      market: "DE",
      fields: "items(track(id, name, album(name, id), artists(name, id))",
      limit: limit,
      offset: offset,
    },
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const fetchArtist = async (accessToken, artistId) =>
  await axios.get(API_URL + ARTISTS_PREF + artistId, {
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const fetchTracksFeatures = async (accessToken, trackIds) =>
  await axios.get(API_URL + FEATURES_PREF + trackIds.join("%2C"), {
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const mapPlaylistChunks = (playlistLength) => {
  // break playlist items GET requests to 100-pieces chunks
  // because of Spotify API limit
  const playlistChunksMap = [];
  for (let i = 0; i < playlistLength; i += 100)
    playlistChunksMap.push({
      limit: playlistLength - i >= 100 ? 100 : playlistLength - i,
      offset: i,
    });
  return playlistChunksMap;
};

export const fetchPlaylist = async (accessToken) => {
  const {
    data: { total },
  } = await fetchPlaylistLength(accessToken);
  let fetchedPlaylist = [];
  // for await (const { limit, offset } of mapPlaylistChunks(total)) {
  // limit chunk to 10 tracks in dev mode
  for await (const { limit, offset } of [{ limit: 10, offset: 200 }]) {
    const {
      data: { items },
    } = await fetchPlaylistItems(accessToken, limit, offset);
    const fetchedPlaylistChunk = [];
    for await (const {
      track: {
        id,
        name,
        artists,
        album: { name: album, id: albumId },
      },
    } of items) {
      // const {
      //   data: { danceability, energy, mode, key, valence },
      // } = await fetchTrackFeatures(accessToken, id);
      fetchedPlaylistChunk.push({
        id,
        name,
        album,
        albumId,
        artists: artists.map(({ name }) => name).join(", "),
        artistsIds: artists.map(({ id }) => id),
        // danceability,
        // energy,
        // mode,
        // key,
        // valence,
      });
    }
    const chunkTracksIds = fetchedPlaylistChunk.map(({ id }) => id);
    const {
      data: { audio_features },
    } = await fetchTracksFeatures(accessToken, chunkTracksIds);
    fetchedPlaylistChunk.forEach((track, index) =>
      Object.assign(
        track,
        audio_features.map(({ danceability, energy, mode, key, valence }) => ({
          danceability,
          energy,
          mode,
          key,
          valence,
        }))[index]
      )
    );
    console.log(fetchedPlaylistChunk);
    fetchedPlaylist = [...fetchedPlaylist, ...fetchedPlaylistChunk];
  }
  return { total, fetchedPlaylist };
};
