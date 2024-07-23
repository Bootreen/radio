import "./App.css";
import { useAuthToken } from "./utils/authorization-hook";
import { fetchAllPlaylistData } from "./utils/fetch-spotify-data";
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

  // custom authorization hook
  useAuthToken();

  (async () => {
    // Load only if authorization is completed and accessToken is received
    // Prevent infinite reloads — load only once
    if (isAuthorized && !isLoaded) {
      const { length, tracks, artists, albums, genres } =
        await fetchAllPlaylistData(accessToken);
      setPlaylistLength(length);
      setPlaylist(tracks);
      setIsLoaded(true);
    }
  })();

  window.onSpotifyIframeApiReady = (iFrameApi) => {
    const element = document.getElementById("embed-iframe");
    const options = {
      width: "75%",
      height: "200",
    };
    const callback = (EmbedController) => {
      document
        .querySelector("iframe")
        .addEventListener("startTrack", (event) => {
          EmbedController.loadUri("spotify:track:" + event.detail.id);
          EmbedController.play();
        });
    };
    iFrameApi.createController(element, options, callback);
  };

  const dispatchStartTrack = (i) => {
    document.querySelector("iframe").dispatchEvent(
      new CustomEvent("startTrack", {
        detail: { id: playlist[i].id },
        bubbles: true,
        cancelable: true,
        composed: false,
      })
    );
  };

  return (
    <div className='main-container'>
      <h1>Radio "Bootreen"</h1>
      <h4>Total tracks: {playlistLength}</h4>
      <ul>
        {isLoaded &&
          playlist
            // .filter((_, i) => i <= 500 && i > 490)
            .map(({ name, artists, album }, i) => (
              <li
                className='track'
                key={i}
                onClick={() => dispatchStartTrack(i)}
              >
                {name} - {artists} ({album})
              </li>
            ))}
      </ul>
      <div id='embed-iframe' className='player'></div>
    </div>
  );
};

export default App;
