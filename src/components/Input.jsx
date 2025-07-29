import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Input = ({ handleUrlChange, handlePlaylistInfo, playListInfo }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTop, setIsTop] = useState(false);

  const playlistRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?youtube\.com\/(?:playlist\?list=|watch\?v=\w+&list=)([a-zA-Z0-9_-]+)/;

  const isValidYouTubePlaylistUrl = (url) => {
    const result = playlistRegex.exec(url);
    return result
      ? { valid: true, playlistId: result[1] }
      : { valid: false, playlistId: "" };
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
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${text.split("=")[1]
        }&key=${import.meta.env.VITE_YOUTUBE_API_KEY
        }&maxResults=50&part=snippet,id${nextPageToken ? `&pageToken=${nextPageToken}` : ""
        }`;

      const response = await axios.get(url);
      const playlistData = response?.data.items;

      setIsLoading(false);
      if (playlistData.length > 0) {
        handlePlaylistInfo((prev) => [...prev, ...playlistData]);
        setError("");
        setIsTop(true);
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
    <div
      className={`flex flex-col items-center px-4 transition-all duration-500 ease-in-out ${isTop ? "mt-12" : "mt-[30vh]"
        }`}
    >
      <div className="w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={text}
            placeholder="Paste YouTube Playlist URL"
            onChange={handleChange}
            className={`w-full px-6 py-4 text-lg text-gray-800 bg-white border-2 rounded-full focus:outline-none focus:ring-2 transition-all duration-300 ${!playlistRegex.test(text)
              ? "focus:ring-red-300 border-red-300"
              : "focus:ring-indigo-300 border-indigo-300"
              } shadow-md hover:shadow-lg`}
          />
          <button
            onClick={() => {
              getPlaylistData("");
              handlePlaylistInfo([]);
            }}
            disabled={!playlistRegex.test(text) || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Get Playlist"
            )}
          </button>
        </div>
        <div
          className={`mt-4 text-center transition-all duration-300 ${error ? "text-red-500" : "text-gray-600"
            }`}
        >
          {!playlistRegex.test(text) ? (
            <p className="text-sm">
              ✨ URL must contain '&list=' or 'playlist?list=' parameter
            </p>
          ) : error ? (
            <p className="text-sm">{error}</p>
          ) : isLoading ? (
            <p className="text-sm animate-pulse">Fetching Playlist...</p>
          ) : playListInfo.length > 0 ? (
            <p className="text-lg font-semibold text-indigo-600">
              Found {playListInfo.length} videos in the playlist
            </p>
          ) : null}
        </div>
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#4338CA",
            color: "#ffffff",
            padding: "16px",
            borderRadius: "9999px",
          },
        }}
      />
    </div>
  );
};

export default Input;