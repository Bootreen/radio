import axios from "axios";
import {
  SPOTIFY_PATHS,
  PLAYLIST_ID,
  TOKEN_TYPE,
  COMMA,
  SPACED_COMMA,
} from "../store/constants";

const {
  API_URL,
  PLAYLISTS_PREF,
  ALBUMS_PREF,
  ARTISTS_PREF,
  FEATURES_PREF,
  TRACKS_POSTF,
} = SPOTIFY_PATHS;

const fetchPlaylistLength = async (accessToken, playlistId) =>
  await axios.get(API_URL + PLAYLISTS_PREF + playlistId + TRACKS_POSTF, {
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

const fetchPlaylistItems = async (accessToken, playlistId, limit, offset) =>
  await axios.get(API_URL + PLAYLISTS_PREF + playlistId + TRACKS_POSTF, {
    params: {
      market: "DE",
      fields:
        "items(track(id, name, duration_ms, popularity, album(name, id), artists(name, id))",
      limit: limit,
      offset: offset,
    },
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const fetchAlbums = async (accessToken, albumsIds) =>
  await axios.get(API_URL + ALBUMS_PREF + albumsIds.join(COMMA), {
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const fetchArtists = async (accessToken, artistsIds) =>
  await axios.get(API_URL + ARTISTS_PREF + artistsIds.join(COMMA), {
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const fetchTracksFeatures = async (accessToken, tracksIds) =>
  await axios.get(API_URL + FEATURES_PREF + tracksIds.join(COMMA), {
    headers: {
      Authorization: `${TOKEN_TYPE} ${accessToken}`,
    },
  });

const mapChunks = (playlistLength) => {
  // break GET requests to 100-pieces chunks because of Spotify API limit
  const сhunksMap = [];
  for (let i = 0; i < playlistLength; i += 100)
    сhunksMap.push({
      limit: playlistLength - i >= 100 ? 100 : playlistLength - i,
      offset: i,
    });
  return сhunksMap;
};

const fetchAllPlaylistItems = async (
  accessToken,
  playlistId,
  playlistLength
) => {
  let fetchedPlaylist = [];
  // for await (const { limit, offset } of mapChunks(playlistLength)) {
  // limit chunk to 10 tracks in dev mode
  for await (const { limit, offset } of [{ limit: 10, offset: 450 }]) {
    const {
      data: { items },
    } = await fetchPlaylistItems(accessToken, playlistId, limit, offset);
    const fetchedPlaylistChunk = [];
    for await (const {
      track: {
        id,
        name,
        artists,
        album: { name: album, id: albumId },
        duration_ms: duration,
        popularity,
      },
    } of items) {
      fetchedPlaylistChunk.push({
        id,
        name,
        duration,
        album,
        albumId,
        artists: artists.map(({ name }) => name).join(SPACED_COMMA),
        artistsIds: artists.map(({ id }) => id),
        popularity,
        genres: [],
      });
    }
    const chunkTracksIds = fetchedPlaylistChunk.map(({ id }) => id);
    const {
      data: { audio_features: allFeatures },
    } = await fetchTracksFeatures(accessToken, chunkTracksIds);
    const filteredFeatures = allFeatures.map(
      ({ danceability, energy, mode, key, valence }) => ({
        danceability,
        energy,
        mode,
        key,
        valence,
      })
    );
    fetchedPlaylistChunk.forEach((track, index) =>
      Object.assign(track, filteredFeatures[index])
    );
    fetchedPlaylist = [...fetchedPlaylist, ...fetchedPlaylistChunk];
  }
  return fetchedPlaylist;
};

const collectSecondaryPlaylistIds = (playlist) => {
  const artistsIds = [];
  const albumsIds = [];
  playlist.forEach(({ albumId, artistsIds: artistsIdsOfTrack }) => {
    artistsIdsOfTrack.forEach((artistId) => {
      if (!artistsIds.includes(artistId)) artistsIds.push(artistId);
    });
    if (!albumsIds.includes(albumId)) albumsIds.push(albumId);
  });
  return { artistsIds, albumsIds };
};

const fetchAllArtists = async (accessToken, artistsIds) => {
  let artists = [];
  for await (const { limit, offset } of mapChunks(artistsIds.length)) {
    const {
      data: { artists: artistsChunk },
    } = await fetchArtists(accessToken, artistsIds.slice(offset, limit));
    artists = [
      ...artists,
      ...artistsChunk.map(({ id, name, popularity, genres, images }) => ({
        id,
        name,
        popularity,
        genres,
        imageUrl: images[0].url,
      })),
    ];
  }
  return artists;
};

const fetchAllAlbums = async (accessToken, albumsIds) => {
  let albums = [];
  for await (const { limit, offset } of mapChunks(albumsIds.length)) {
    const {
      data: { albums: albumsChunk },
    } = await fetchAlbums(accessToken, albumsIds.slice(offset, limit));
    albums = [
      ...albums,
      ...albumsChunk.map(({ id, name, popularity, release_date, images }) => ({
        id,
        name,
        releaseDate: release_date,
        popularity,
        genres: [],
        imageUrl: images[0].url,
      })),
    ];
  }
  return albums;
};

const collectGenresFromArtists = (artists) => {
  const genres = [];
  artists.forEach(({ genres: artistGenres }) => {
    artistGenres.forEach((genre) => {
      if (!genres.includes(genre)) genres.push(genre);
    });
  });
  return genres;
};

export const fetchAllPlaylistData = async (accessToken) => {
  const {
    data: { total },
  } = await fetchPlaylistLength(accessToken, PLAYLIST_ID);
  const fetchedPlaylist = await fetchAllPlaylistItems(
    accessToken,
    PLAYLIST_ID,
    total
  );
  const { artistsIds, albumsIds } =
    collectSecondaryPlaylistIds(fetchedPlaylist);
  const fetchedArtists = await fetchAllArtists(accessToken, artistsIds);
  const fetchedAlbums = await fetchAllAlbums(accessToken, albumsIds);
  const genres = collectGenresFromArtists(fetchedArtists);
  return {
    length: total,
    tracks: fetchedPlaylist,
    artists: fetchedArtists,
    albums: fetchedAlbums,
    genres,
  };
};
