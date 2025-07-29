export const formatDuration = (duration) => {
  if (!duration) return "";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");

  let formatted = "";
  if (hours) formatted += `${hours}:`;
  formatted += `${minutes.padStart(2, "0")}:`;
  formatted += seconds.padStart(2, "0");

  return `[${formatted}]`;
};

export const formatters = {
  none: (items, { customPrefix }) => {
    return items.map((item) => `${customPrefix}${item}`);
  },

  bulleted: (items, { customPrefix }) => {
    const bullet = customPrefix || "- ";
    return items.map((item) => `${bullet}${item}`);
  },

  numbered: (items, { customPrefix }) => {
    return items.map(
      (item, i) =>
        `${customPrefix ? `${customPrefix}${i + 1}` : i + 1}. ${item}`
    );
  },

  Programming: (items, { ProgrammingBrackets }) => {
    const [open, close] = ProgrammingBrackets.split("");
    return [
      `${open}`,
      ...items.map(
        (item, index) => `  ${item}${index < items.length - 1 ? "," : ""}`
      ),
      close,
    ];
  },
};

export const formatList = (processedList, options) => {
  const {
    includeHtml = true,
    includeUrl = false,
    showDuration = false,
    listType = "none",
    customPrefix = "",
    ProgrammingBrackets = "[]",
    videoDetails = {},
    urlOnly = false,
    showChannelName = true,
  } = options;

  const baseItems = processedList.map((l) => {
    if (!l?.snippet?.resourceId?.videoId) {
      return "Video unavailable";
    }
    const { resourceId } = l.snippet;
    const videoId = resourceId.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    if (urlOnly) {
      return url;
    }

    const { title = "Untitled" } = l.snippet;
    const details = videoDetails[videoId] || {};
    const duration = details.duration || "PT0M0S";
    const formattedDuration = showDuration ? formatDuration(duration) : "";
    const channelName = details.channelTitle || "[Channel Unavailable]";

    // Build the prefix with duration and channel name
    let prefix = "";
    if (formattedDuration) prefix += formattedDuration;
    if (showChannelName) {
      if (prefix) prefix += " • ";
      prefix += `[${channelName}]`;
    }

    // Add bullet separator if we have a prefix
    const content = prefix ? `${prefix} • ${title}` : title;

    if (includeHtml) {
      return includeUrl
        ? `<a target="_blank" href="${url}" class="text-blue-600 hover:text-blue-800 underline">${content}</a>`
        : content;
    }

    return includeUrl
      ? `[${content}](${url})`
      : content;
  });

  const formatter = formatters[listType] || formatters.none;
  const formattedItems = formatter(baseItems, {
    customPrefix,
    ProgrammingBrackets,
  });

  if (listType === "Programming") {
    return formattedItems.join("\n");
  }

  return includeHtml ? formattedItems.join("<br>") : formattedItems.join("\n");
};
