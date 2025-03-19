import React, { useState } from "react";
import toast from "react-hot-toast";
import { useVideoDurations } from "../hooks/useVideoDurations";
import { useProcessedList } from "../hooks/useProcessedList";
import { formatList } from "../utils/formatters";

const Results = ({ list }) => {
  const [listType, setListType] = useState("none");
  const [customPrefix, setCustomPrefix] = useState("");
  const [ProgrammingBrackets, setProgrammingBrackets] = useState("[]");
  const [checkedReverse, setCheckedReverse] = useState(false);
  const [checkedRemovePriv, setCheckedRemovePriv] = useState(false);
  const [checkedRemoveDuplicates, setCheckedRemoveDuplicates] = useState(false);
  const [includeUrl, setIncludeUrl] = useState(false);
  const [regexFilter, setRegexFilter] = useState("");
  const [negateRegex, setNegateRegex] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [urlOnly, setUrlOnly] = useState(false);

  const videoDurations = useVideoDurations(list);
  const processedList = useProcessedList(list, {
    checkedRemovePriv,
    checkedRemoveDuplicates,
    checkedReverse,
    regexFilter,
    negateRegex,
    showDuration,
  });

  const getFormattedList = (includeHtml = true) => {
    return formatList(processedList, {
      includeHtml,
      includeUrl,
      showDuration,
      listType,
      customPrefix,
      ProgrammingBrackets,
      videoDurations,
      urlOnly,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedList(false));
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-gradient-to-br from-purple-100 to-indigo-200 shadow-xl rounded-2xl overflow-hidden">
      <div className="p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="font-bold text-indigo-800 mb-6 text-2xl">
              Formatting
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {["none", "bulleted", "numbered", "Programming"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center cursor-pointer"
                  >
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
                    placeholder={
                      listType === "numbered"
                        ? "1. "
                        : listType === "bulleted"
                        ? "- "
                        : "Enter prefix"
                    }
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
                    Enter the opening and closing brackets, e.g. '[]' for list,
                    '()' for tuple
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Options Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h3 className="font-bold text-indigo-800 mb-6 text-2xl">Options</h3>
            <div className="space-y-4">
              {[
                {
                  label: "Reverse Order",
                  state: checkedReverse,
                  setState: setCheckedReverse,
                },
                {
                  label: "Remove Deleted/Private Videos",
                  state: checkedRemovePriv,
                  setState: setCheckedRemovePriv,
                },
                {
                  label: "Remove Duplicates",
                  state: checkedRemoveDuplicates,
                  setState: setCheckedRemoveDuplicates,
                },
                {
                  label: "Include Video URL",
                  state: includeUrl,
                  setState: setIncludeUrl,
                },
                {
                  label: "Show Duration",
                  state: showDuration,
                  setState: setShowDuration,
                },
                {
                  label: "URLs only",
                  state: urlOnly,
                  setState: setUrlOnly,
                },
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
              <fieldset className="border border-gray-300 rounded-md p-4">
                <legend className="text-sm font-medium text-gray-700 mb-1">
                  Regex Filter
                </legend>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pattern
                  </label>
                  <input
                    type="text"
                    value={regexFilter}
                    onChange={(e) => setRegexFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                    placeholder="Enter regex pattern"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Filter video titles using a regular expression
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={negateRegex}
                    onChange={() => setNegateRegex(!negateRegex)}
                    className="mr-2 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    id="regex-checkbox"
                  />
                  <label
                    htmlFor="regex-checkbox"
                    className="text-gray-700 cursor-pointer select-none"
                  >
                    Invert Regex
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-10">
          <h3 className="font-bold text-indigo-800 mb-6 text-2xl">Results:</h3>
          <div className="bg-white rounded-xl border border-gray-300 h-96 overflow-y-auto p-8 shadow-inner">
            <div
              className="whitespace-pre-wrap break-words text-gray-800"
              dangerouslySetInnerHTML={{ __html: getFormattedList() }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-indigo-700 font-semibold text-xl">
            Found {processedList.length}{" "}
            {processedList.length === 1 ? "Video" : "Videos"}
          </p>
          <button
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 shadow-lg transform hover:scale-105"
            onClick={copyToClipboard}
          >
            Copy To Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
