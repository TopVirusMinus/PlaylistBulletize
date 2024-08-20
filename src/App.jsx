import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Input from "./components/Input";
import Results from "./components/Results";
import Footer from "./components/Footer";

function App() {
  const [url, setUrl] = useState("");
  const [getPlaylistInfo, setPlaylistInfo] = useState([]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="max-w-3xl mx-auto">
          <Input
            handleUrlChange={setUrl}
            handlePlaylistInfo={setPlaylistInfo}
            playListInfo={getPlaylistInfo}
          />
          {getPlaylistInfo.length > 0 && (
            <div className="mt-12">
              <Results list={getPlaylistInfo} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;