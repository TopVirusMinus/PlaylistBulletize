import { useState, useEffect } from "react";

export const useVideoDetails = (list) => {
  const [videoDetails, setVideoDetails] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      const videoIds = list
        .filter(item => item?.snippet?.resourceId?.videoId)
        .map((item) => item.snippet.resourceId.videoId);

      if (videoIds.length === 0) {
        return;
      }

      const chunks = [];
      for (let i = 0; i < videoIds.length; i += 50) {
        chunks.push(videoIds.slice(i, i + 50));
      }

      const detailsMap = {};
      for (const chunk of chunks) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` +
            `id=${chunk.join(",")}&part=contentDetails,snippet&key=${import.meta.env.VITE_YOUTUBE_API_KEY
            }`
          );
          const data = await response.json();

          data.items.forEach((item) => {
            detailsMap[item.id] = {
              duration: item.contentDetails.duration,
              channelTitle: item.snippet.channelTitle
            };
          });
        } catch (error) {
          console.error("Error fetching video details:", error);
        }
      }
      setVideoDetails(detailsMap);
    };

    if (list.length > 0) {
      fetchDetails();
    }
  }, [list]);

  return videoDetails;
};
