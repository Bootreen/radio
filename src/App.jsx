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

  // custom authorization hook
  useAuthToken();

  (async () => {
    // Load only if authorization is completed and accessToken is received
    // Prevent infinite reloads — load only once
    if (isAuthorized && !isLoaded) {
      const {
        data: { total },
      } = await fetchPlaylistLength(accessToken);
      setPlaylistLength(total);

      // Short playlist fetch version (10 songs)
      const {
        data: { items },
      } = await fetchPlaylistItems(accessToken, 10, 5);
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

      // FULL VERSION (all 2k songs)
      // const playlistChuncksMap = [];
      // for (let i = 0; i < playlistLength; i += 100)
      //   playlistChuncksMap.push({
      //     limit: playlistLength - i >= 100 ? 100 : playlistLength - i,
      //     offset: i,
      //   });
      // let fetchedPlaylist = [];
      // for await (const { limit, offset } of playlistChuncksMap) {
      //   const {
      //     data: { items },
      //   } = await fetchPlaylistItems(accessToken, limit, offset);
      //   fetchedPlaylist = [
      //     ...fetchedPlaylist,
      //     ...items.map(
      //       ({
      //         track: {
      //           uri,
      //           name,
      //           artists,
      //           album: { name: album, id: albumId },
      //         },
      //       }) => ({
      //         uri,
      //         name,
      //         artists: artists.map(({ name }) => name).join(", "),
      //         album,
      //         albumId,
      //       })
      //     ),
      //   ];
      // }
      // setPlaylist(fetchedPlaylist);
      setIsLoaded(true);
    }
  })();

  window.onSpotifyIframeApiReady = (iFrameApi) => {
    const element = document.getElementById("embed-iframe");
    const options = {
      width: "75%",
      height: "200",
      // uri: "spotify:track:4KwvTXx3yR0FA4LGfxD4xP",
    };
    const callback = (EmbedController) => {
      document
        .querySelector("iframe")
        .addEventListener("startTrack", (event) => {
          console.log("Start track, uri:", event.detail.uri);
          EmbedController.loadUri(event.detail.uri);
          EmbedController.play();
        });
    };
    iFrameApi.createController(element, options, callback);
  };

  const dispatchStartTrack = (i) => {
    document.querySelector("iframe").dispatchEvent(
      new CustomEvent("startTrack", {
        detail: { uri: playlist[i].uri },
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
            // .filter((_, i) => i <= 5)
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
