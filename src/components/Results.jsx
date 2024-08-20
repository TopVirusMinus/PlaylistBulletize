import React, { useState, useEffect } from "react";

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-sm flex items-center">
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 focus:outline-none">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

const Results = ({ list }) => {
  const [listType, setListType] = useState("none");
  const [customPrefix, setCustomPrefix] = useState("");
  const [ProgrammingBrackets, setProgrammingBrackets] = useState("[]");
  const [checkedReverse, setCheckedReverse] = useState(false);
  const [checkedRemovePriv, setCheckedRemovePriv] = useState(false);
  const [checkedRemoveDuplicates, setCheckedRemoveDuplicates] = useState(false);
  const [includeUrl, setIncludeUrl] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [processedList, setProcessedList] = useState([]);

  useEffect(() => {
    let processed = list;

    if (checkedRemovePriv) {
      processed = processed.filter(v => !v.snippet.title.includes("Deleted video") && !v.snippet.title.includes("Private video"));
    }

    if (checkedRemoveDuplicates) {
      const seen = new Set();
      processed = processed.filter(item => {
        const duplicate = seen.has(item.snippet.resourceId.videoId);
        seen.add(item.snippet.resourceId.videoId);
        return !duplicate;
      });
    }

    if (checkedReverse) {
      processed = processed.slice().reverse();
    }

    setProcessedList(processed);
  }, [list, checkedRemovePriv, checkedRemoveDuplicates, checkedReverse]);

  const formatListItem = (item, index) => {
    const { title, resourceId } = item.snippet;
    const videoId = resourceId.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const videoInfo = includeUrl ? `${title} - ${url}` : title;

    if (listType === "Programming") {
      return `"${videoInfo.replace(/"/g, '\\"')}"`;
    }

    let prefix = "";
    if (listType === "bulleted") {
      prefix = customPrefix || "- ";
    } else if (listType === "numbered") {
      prefix = customPrefix ? `${customPrefix}${index + 1}. ` : `${index + 1}. `;
    } else if (customPrefix) {
      prefix = customPrefix;
    }

    return `${prefix}${videoInfo}`;
  };

  const getFormattedList = () => {
    const formattedItems = processedList.map((l, i) => formatListItem(l, i));
    if (listType === "Programming") {
      const [openBracket, closeBracket] = ProgrammingBrackets.split('');
      return `${openBracket}\n  ${formattedItems.join(",\n  ")}\n${closeBracket}`;
    }
    return formattedItems.join("\n");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedList());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg rounded-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-4xl font-bold text-indigo-900 mb-8">YouTube Playlist Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Formatting</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {["none", "bulleted", "numbered", "Programming"].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="listType"
                      value={type}
                      checked={listType === type}
                      onChange={() => setListType(type)}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
              {listType !== "Programming" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Prefix
                  </label>
                  <input
                    type="text"
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                    placeholder={listType === "numbered" ? "1. " : listType === "bulleted" ? "- " : "Enter prefix"}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {listType === "numbered" 
                      ? "Will be prepended to the number, e.g. 'Chapter 1. '" 
                      : listType === "bulleted"
                      ? "Will replace the default bullet point"
                      : "Will be prepended to each item"}
                  </p>
                </div>
              )}
              {listType === "Programming" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Programming Brackets
                  </label>
                  <input
                    type="text"
                    value={ProgrammingBrackets}
                    onChange={(e) => setProgrammingBrackets(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                    placeholder="[]"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the opening and closing brackets, e.g. '[]' for list, '()' for tuple
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Options</h3>
            <div className="space-y-4">
              {[
                { label: "Reverse Order", state: checkedReverse, setState: setCheckedReverse },
                { label: "Remove Deleted/Private Videos", state: checkedRemovePriv, setState: setCheckedRemovePriv },
                { label: "Remove Duplicates", state: checkedRemoveDuplicates, setState: setCheckedRemoveDuplicates },
                { label: "Include Video URL", state: includeUrl, setState: setIncludeUrl }
              ].map(({ label, state, setState }) => (
                <label key={label} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={() => setState(!state)}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-semibold text-indigo-800 mb-4 text-xl">Results:</h3>
          <div className="bg-white rounded-lg border border-gray-300 h-96 overflow-y-auto p-6 shadow-inner">
            <pre className="whitespace-pre-wrap break-words text-gray-800">
              {getFormattedList()}
            </pre>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-indigo-700 font-medium text-lg">
            Found {processedList.length} {processedList.length === 1 ? "Video" : "Videos"}
          </p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-lg"
            onClick={copyToClipboard}
          >
            Copy To Clipboard
          </button>
        </div>
      </div>
      {showToast && (
        <Toast 
          message="Copied to clipboard!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
};

export default Results;