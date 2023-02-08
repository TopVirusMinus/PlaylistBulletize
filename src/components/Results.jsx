import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Results = ({ list }) => {
  const [listType, setListType] = useState("none");
  const [custom, setCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [checkedReverse, setCheckedReverse] = useState(false);
  const listOfVideos = list.map((l, i) =>
    custom
      ? `${customText}${l.snippet.title}`
      : listType === "bulleted"
      ? `- ${l.snippet.title}`
      : listType === "numbered"
      ? `${i + 1}. ${l.snippet.title}`
      : `${l.snippet.title}`
  );

  checkedReverse && listOfVideos.reverse();

  const copyList = listOfVideos.join("\r\n");
  const copyToast = () => toast.success("Copied To Clipboard!");

  return (
    <div className="mx-auto w-fit mt-4">
      <div className="flex flex-col ">
        <p className="font-bold">Formatting: </p>
        <label className="w-28">
          <input
            type="radio"
            disabled={custom}
            name="listType"
            value="none"
            checked={listType === "none"}
            onChange={() => setListType("none")}
            className="mr-2"
          />
          None
        </label>
        <label className="w-28">
          <input
            type="radio"
            disabled={custom}
            name="listType"
            value="bulleted"
            checked={listType === "bulleted"}
            onChange={() => setListType("bulleted")}
            className="mr-2"
          />
          Bulleted
        </label>
        <label className=" w-28">
          <input
            type="radio"
            disabled={custom}
            name="listType"
            value="numbered"
            checked={listType === "numbered"}
            onChange={() => setListType("numbered")}
            className="mr-2"
          />
          Numbered
        </label>
        <div>
          <label>
            <input
              className="mr-2"
              type="checkbox"
              defaultChecked={false}
              onChange={() => setCustom((prev) => !custom)}
            />
            Custom
          </label>
          <input
            type="text"
            disabled={!custom}
            value={customText}
            onChange={(e) => setCustomText((prev) => e.target.value)}
            className={`border-2 ml-2 w-12 outline-none ${
              custom && "border-lime-400"
            }`}
          />
        </div>
        <label>
          <input
            className="mr-2"
            type="checkbox"
            defaultChecked={checkedReverse}
            onChange={() => setCheckedReverse(!checkedReverse)}
          />
          Reverse
        </label>
      </div>
      <div className="read-only overflow-scroll w-fit lg:max-w-80% sm:w-100% w-max-sm mt-5 font-semibold block h-80 px-3 outline-none text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
        {listOfVideos.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <p>
        Found{" "}
        {listOfVideos.length === 1
          ? `${listOfVideos.length} Video`
          : `${listOfVideos.length} Videos`}
      </p>
      <button
        className="mt-2 mx-auto bg-white hover:bg-lime-500 hover:text-black text-gray-800 font-semibold py-2 px-4 border-2 border-lime-500 rounded shadow"
        onClick={() => {
          navigator.clipboard.writeText(copyList);
          copyToast();
        }}
      >
        Copy To Clipboard
      </button>
      <Toaster />
    </div>
  );
};

export default Results;
