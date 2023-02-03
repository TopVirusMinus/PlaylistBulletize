import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const Input = ({ handleUrlChange, handlePlaylistInfo }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState("");
  const [error, setError] = useState("");

  let playlistRegex = /https:\/\/www\.youtube\.com\/playlist\?list=[\S]+/;

  const handleChange = (e) => {
    setText((prev) => e.target.value);
    handleUrlChange((prev) => e.target.value);
  };
  const getPlaylistData = async () => {
    try {
      setIsLoading((prev) => true);
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${
          text.split("=")[1]
        }&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );
      const playlistData = response.data.items;
      setIsLoading((prev) => false);
      if (playlistData.length > 0) {
        setPlaylist((prev) => playlistData);
        handlePlaylistInfo((prev) => playlistData);
        setError((prev) => "");
      } else {
        setPlaylist((prev) => "");
        handlePlaylistInfo((prev) => "");
        setError((prev) => "Playlist Not Found");
      }
    } catch (error) {
      setError((prev) => error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={text}
        placeholder="Paste URL"
        onChange={(e) => handleChange(e)}
        className={`bg-transparent outline-none p-2 w-96 ${
          !playlistRegex.test(text) ? "outline-red-600" : "outline-lime-400"
        } `}
      />
      <p className=" mt-2 text-gray-700">
        {!playlistRegex.test(text)
          ? "URL Format must be https://www.youtube.com/playlist?list="
          : isLoading
          ? "Fetching Playlist..."
          : error
          ? error
          : playlist[0]
          ? playlist[0].snippet.localized.title
          : ""}
      </p>
      <button
        onClick={() => getPlaylistData()}
        disabled={!playlistRegex.test(text)}
        className="border-2 enabled:border-black p-2 w-64 font-bold rounded-md enabled:hover:bg-black enabled:hover:text-gray-50 disabled:border-[gray] disabled:text-gray-600"
      >
        Fetch
      </button>
    </div>
  );
};

export default Input;
