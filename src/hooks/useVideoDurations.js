import { useState, useEffect } from "react";

export const useVideoDurations = (list) => {
  const [videoDurations, setVideoDurations] = useState({});

  useEffect(() => {
    const fetchDurations = async () => {
      const videoIds = list.map((item) => item.snippet.resourceId.videoId);
      const chunks = [];
      for (let i = 0; i < videoIds.length; i += 50) {
        chunks.push(videoIds.slice(i, i + 50));
      }

      const durationsMap = {};
      for (const chunk of chunks) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` +
              `id=${chunk.join(",")}&part=contentDetails&key=${
                import.meta.env.VITE_YOUTUBE_API_KEY
              }`
          );
          const data = await response.json();

          data.items.forEach((item) => {
            durationsMap[item.id] = item.contentDetails.duration;
          });
        } catch (error) {
          console.error("Error fetching video durations:", error);
        }
      }
      setVideoDurations(durationsMap);
    };

    if (list.length > 0) {
      fetchDurations();
    }
  }, [list]);

  return videoDurations;
};
