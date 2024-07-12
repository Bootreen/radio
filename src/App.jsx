import "./App.css";
import { useAuthToken } from "./utils/authorization-hook";
import {
  fetchPlaylistLength,
  fetchPlaylistItems,
} from "./utils/fetch-spotify-data";
import { useRadioStore, useRadioActions } from "./store/store";

const App = () => {
  const { access_token: accessToken } = useRadioStore(
    ({ tokenData }) => tokenData
  );
  const playlistLength = useRadioStore(({ playlistLength }) => playlistLength);
  const playlist = useRadioStore(({ playlist }) => playlist);
  const isAuthorized = useRadioStore(({ isAuthorized }) => isAuthorized);
  const isLoaded = useRadioStore(({ isLoaded }) => isLoaded);
  const { setPlaylistLength, setPlaylist, setIsLoaded } = useRadioActions();

  useAuthToken();

  (async () => {
    // Load only if authorization is completed and accessToken is received
    // Prevent infinite reloads
    if (isAuthorized && !isLoaded) {
      const {
        data: { total },
      } = await fetchPlaylistLength(accessToken);
      setPlaylistLength(total);
      const {
        data: { items },
      } = await fetchPlaylistItems(accessToken, 10, 500);
      setPlaylist(
        items.map(
          ({
            track: {
              uri,
              name,
              artists,
              album: { name: album, id: albumId },
            },
          }) => ({
            uri,
            name,
            artists: artists.map(({ name }) => name).join(", "),
            album,
            albumId,
          })
        )
      );
      setIsLoaded(true);
    }
  })();

  return (
    <div className='main-container'>
      <h1>Radio "Boot"</h1>
      <h4>Total tracks: {playlistLength}</h4>
      <ul>
        {isLoaded &&
          playlist.map(({ name, artists, album }, id) => (
            <li key={id}>
              {name} - {artists} ({album})
            </li>
          ))}
      </ul>
      <div id='embed-iframe' className='player'></div>
    </div>
  );
};

export default App;
