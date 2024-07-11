import "./App.css";
import { useAuthToken } from "./utils/authorization-hook";
import { useRadioStore } from "./store/store";

const App = () => {
  const { access_token } = useRadioStore(({ tokenData }) => tokenData);
  useAuthToken();

  return (
    <div className='main-container'>
      <h1>Radio "Boot"</h1>
      <div id='embed-iframe' className='player'></div>
    </div>
  );
};

export default App;
