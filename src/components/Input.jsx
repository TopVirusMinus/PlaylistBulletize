import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Input = ({ handleUrlChange, handlePlaylistInfo, playListInfo }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const playlistRegex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?youtube\.com\/(?:playlist\?list=|watch\?v=\w+&list=)([a-zA-Z0-9_-]+)/;

  const isValidYouTubePlaylistUrl = (url) => {
    const result = playlistRegex.exec(url);
    return result ? { valid: true, playlistId: result[1] } : { valid: false, playlistId: "" };
  };

  useEffect(() => {
    if (isValidYouTubePlaylistUrl(text).valid) {
      const id = playlistRegex.exec(text)[1];
      setText(`https://www.youtube.com/playlist?list=${id}`);
    }
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
    handleUrlChange(e.target.value);
  };

  const getPlaylistData = async (nextPageToken, ct = 0) => {
    try {
      setIsLoading(true);
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${
        text.split("=")[1]
      }&key=${
        import.meta.env.VITE_YOUTUBE_API_KEY
      }&maxResults=50&part=snippet,id${
        nextPageToken ? `&pageToken=${nextPageToken}` : ""
      }`;

      const response = await axios.get(url);
      const playlistData = response?.data.items;
      
      setIsLoading(false);
      if (playlistData.length > 0) {
        handlePlaylistInfo((prev) => [...prev, ...playlistData]);
        setError("");
      } else {
        handlePlaylistInfo([]);
        setError("Playlist Not Found");
      }

      if (response.data.nextPageToken && ct < 100) {
        getPlaylistData(response.data.nextPageToken, ct + 1);
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while fetching the playlist");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={text}
            placeholder="Paste YouTube Playlist URL"
            onChange={handleChange}
            className={`w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              !playlistRegex.test(text) ? "focus:ring-red-300 border-red-300" : "focus:ring-indigo-300 border-gray-300"
            }`}
          />
          <button
            onClick={() => {
              getPlaylistData("");
              handlePlaylistInfo([]);
            }}
            disabled={!playlistRegex.test(text) || isLoading}
            className="absolute right-0 top-0 mt-2 mr-2 bg-indigo-600 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Loading..." : "Get Playlist"}
          </button>
        </div>
        <p className={`mt-2 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
          {!playlistRegex.test(text)
            ? "✨ URL must contain '&list=' or 'playlist?list=' parameter"
            : error
            ? error
            : isLoading
            ? "Fetching Playlist..."
            : playListInfo.length > 0
            ? `Found ${playListInfo.length} videos in the playlist`
            : ""}
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Input;