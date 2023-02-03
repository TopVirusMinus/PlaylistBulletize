import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Input from "./components/Input";

function App() {
  const [url, setUrl] = useState("");
  const [getPlaylistInfo, setPlaylistInfo] = useState("");
  console.log(getPlaylistInfo);
  return (
    <div className="lg:w-5/6 md:w-full mx-auto">
      <Navbar />
      <Input handleUrlChange={setUrl} handlePlaylistInfo={setPlaylistInfo} />
    </div>
  );
}

export default App;
