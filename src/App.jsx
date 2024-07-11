import "./App.css";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    window.onSpotifyIframeApiReady = (iFrameApi) => {
      const element = document.getElementById("embed-iframe");
      const options = {
        width: "60%",
        height: "200",
        uri: "spotify:track:7lTrxftzzPW4WX7VRh6Vxl",
      };
      // const callback = (EmbedController) => {};
      iFrameApi.createController(element, options, callback);
    };
  }, []);
  return (
    <div className='main-container'>
      <h1>Radio Alex</h1>
      <div id='embed-iframe' className='player'></div>
    </div>
  );
};

export default App;
