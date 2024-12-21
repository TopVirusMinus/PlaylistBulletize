import { useState, useEffect } from "react";

export const useProcessedList = (list, filters) => {
  const [processedList, setProcessedList] = useState([]);

  useEffect(() => {
    let processed = list;

    if (filters.checkedRemovePriv) {
      processed = processed.filter(
        (v) =>
          !v.snippet.title.includes("Deleted video") &&
          !v.snippet.title.includes("Private video")
      );
    }

    if (filters.checkedRemoveDuplicates) {
      const seen = new Set();
      processed = processed.filter((item) => {
        const duplicate = seen.has(item.snippet.resourceId.videoId);
        seen.add(item.snippet.resourceId.videoId);
        return !duplicate;
      });
    }

    if (filters.regexFilter) {
      try {
        const regex = new RegExp(filters.regexFilter, "i");
        processed = processed.filter((item) =>
          filters.negateRegex
            ? !regex.test(item.snippet.title)
            : regex.test(item.snippet.title)
        );
      } catch (error) {
        console.error("Invalid regex:", error);
      }
    }

    if (filters.checkedReverse) {
      processed = processed.slice().reverse();
    }

    setProcessedList(processed);
  }, [list, ...Object.values(filters)]);

  return processedList;
};
