import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const Input = ({ handleUrlChange, handlePlaylistInfo, playListInfo }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  let playlistRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?youtube\.com\/(?:playlist\?list=|watch\?v=\w+&list=)([a-zA-Z0-9_-]+)/;
  const isValidYouTubePlaylistUrl = (url) => {
    var result = playlistRegex.exec(url);
    if (result) {
      return {
        valid: true,
        playlistId: result[1],
      };
    }
    return {
      valid: false,
      playlistId: "",
    };
  };

  useEffect(() => {
    if (isValidYouTubePlaylistUrl(text).valid) {
      let id = playlistRegex.exec(text)[1];

      setText(
        (prev) =>
          playlistRegex.test(text) &&
          `https://www.youtube.com/playlist?list=${id}`
      );
    }
  }, [text]);

  const handleChange = (e) => {
    setText((prev) => e.target.value);
    handleUrlChange((prev) => e.target.value);
  };
  const getPlaylistData = async (nextPageToken, ct) => {
    try {
      setIsLoading((prev) => true);

      const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${
        text.split("=")[1]
      }&key=${
        import.meta.env.VITE_YOUTUBE_API_KEY
      }&maxResults=50&part=snippet,id${
        nextPageToken && `&pageToken=${nextPageToken}`
      }`;

      const response = await axios.get(url);
      const playlistData = response?.data.items;
      let nextPages = [];
      let currentNextPageToken = response.data.nextPageToken;

      setIsLoading((prev) => false);
      if (playlistData.length > 0) {
        handlePlaylistInfo((prev) => [...prev, ...playlistData]);
        setError((prev) => "");
      } else {
        handlePlaylistInfo((prev) => "");
        setError((prev) => "Playlist Not Found");
      }

      if (currentNextPageToken || ct === 100) {
        getPlaylistData(currentNextPageToken, ct + 1);
      } else {
        return;
      }
    } catch (error) {
      //console.log(error);
      setIsLoading((prev) => false);
      setError((prev) => true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={text}
        placeholder="Paste URL"
        onChange={(e) => handleChange(e)}
        className={`bg-transparent outline-none p-2 w-96 max-w-xs ${
          !playlistRegex.test(text) ? "outline-red-600" : "outline-lime-400"
        } `}
      />
      <p
        className={` ${
          !playListInfo[0] ? "opacity-100" : "opacity-0"
        }  sm:text-center mt-2 text-gray-700`}
      >
        {!playlistRegex.test(text) ? (
          <>
            {"✨ URL must contain at the end "}
            <br />
            <strong className="text-lime-600">
              &list=PLDoPjvoNmBAzhFD3niPAa1C1gXG4cs14J
            </strong>
          </>
        ) : isLoading ? (
          "Fetching Playlist..."
        ) : error ? (
          "💔 Playlist Not Found"
        ) : playListInfo[0] ? (
          toast.success("Playlist Found!")
        ) : (
          ""
        )}
      </p>
      <button
        onClick={() => {
          getPlaylistData("");
          handlePlaylistInfo((prev) => "");
        }}
        disabled={!playlistRegex.test(text)}
        className="border-2 enabled:border-black p-2 w-64 font-bold rounded-md enabled:hover:bg-black enabled:hover:text-gray-50 disabled:border-[gray] disabled:text-gray-600"
      >
        Get Playlist
      </button>
      <Toaster />
    </div>
  );
};

export default Input;
