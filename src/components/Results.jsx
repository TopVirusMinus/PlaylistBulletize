import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Results = ({ list }) => {
  const [listType, setListType] = useState("none");
  const [custom, setCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [checkedReverse, setCheckedReverse] = useState(false);
  const [checkedRemovePriv, setCheckedRemovePriv] = useState(false);
  const [includeUrl, setIncludeUrl] = useState(true);

  let listOfVideos = list.map((l, i) => {
    const title = l.snippet.title;
    const videoId = l.snippet.resourceId.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const videoInfo = includeUrl ? `${title} - ${url}` : title;

    if (custom) return `${customText}${videoInfo}`;
    if (listType === "bulleted") return `- ${videoInfo}`;
    if (listType === "numbered") return `${i + 1}. ${videoInfo}`;
    return videoInfo;
  });

  if (checkedReverse) {
    listOfVideos.reverse();
  }

  if (checkedRemovePriv) {
    listOfVideos = listOfVideos.filter(
      (v) => !v.includes("Deleted video") && !v.includes("Private video")
    );
  }

  const copyList = listOfVideos.join("\r\n");
  const copyToast = () => toast.success("Copied To Clipboard!");

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Playlist Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Formatting</h3>
            <div className="space-y-2">
              {["none", "bulleted", "numbered"].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    disabled={custom}
                    name="listType"
                    value={type}
                    checked={listType === type}
                    onChange={() => setListType(type)}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Options</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={custom}
                  onChange={() => setCustom(!custom)}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Custom Prefix</span>
              </label>
              {custom && (
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter prefix"
                />
              )}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedReverse}
                  onChange={() => setCheckedReverse(!checkedReverse)}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Reverse Order</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedRemovePriv}
                  onChange={() => setCheckedRemovePriv(!checkedRemovePriv)}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Remove Deleted/Private Videos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeUrl}
                  onChange={() => setIncludeUrl(!includeUrl)}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">Include Video URL</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Playlist</h3>
          <div className="bg-gray-50 rounded-lg border border-gray-300 h-80 overflow-y-auto p-4">
            {listOfVideos.map((l, i) => (
              <div key={i} className="mb-2 text-gray-800">
                {listType === "numbered" && <span className="font-semibold">{`${i + 1}. `}</span>}
                {listType === "bulleted" && <span className="font-semibold mr-1">-</span>}
                {custom && <span className="font-semibold">{customText}</span>}
                <span>{l.split(" - ")[1]}</span>
                {includeUrl && (
                  <>
                    <span className="mx-1">-</span>
                    <a href={l.split(" - ")[1]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                      {l.split(" - ")[1]}
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Found {listOfVideos.length} {listOfVideos.length === 1 ? "Video" : "Videos"}
          </p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={() => {
              navigator.clipboard.writeText(copyList);
              copyToast();
            }}
          >
            Copy To Clipboard
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Results;