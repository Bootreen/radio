import { useEffect } from "react";
import { useRadioStore, useRadioActions } from "../store/store";
import axios from "axios";

export const useAuthToken = () => {
  const playlist = useRadioStore(({ playlist }) => playlist);
  const { setToken, setIsAuthorized } = useRadioActions();
  useEffect(() => {
    (async () => {
      console.log("Authorisation started");
      console.log("Client ID:", process.env.CLIENT_ID);
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
      console.log(token);
      // Add error handling
      setToken(token);
      setIsAuthorized(true);
    })();
  }, []);
};
