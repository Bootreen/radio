import { useEffect } from "react";
import { useRadioActions } from "../store/store";
import axios from "axios";

export const useAuthToken = () => {
  const { setToken } = useRadioActions();
  useEffect(() => {
    (async () => {
      const { data: token } = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          // Sensitive information like id keys are stored
          // in environment variables (file .env)
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        })
      );
      setToken(token);
    })();

    // mount embed player (temporary)
    window.onSpotifyIframeApiReady = (iFrameApi) => {
      const element = document.getElementById("embed-iframe");
      const options = {
        width: "60%",
        height: "200",
        uri: "spotify:track:7lTrxftzzPW4WX7VRh6Vxl",
      };
      // const callback = (EmbedController) => {};
      const callback = () => {};
      iFrameApi.createController(element, options, callback);
    };
  }, []);
};
