import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Results = ({ list }) => {
  const [listType, setListType] = useState("bulleted");
  console.log(listType);

  const listOfVideos = list.map((l, i) =>
    listType === "bulleted"
      ? `- ${l.snippet.title}`
      : `${i + 1}. ${l.snippet.title}`
  );

  const copyList = listOfVideos.join("\r\n");
  const copyToast = () => toast.success("Copied To Clipboard!");

  return (
    <div className="mx-auto w-fit mt-4">
      <div className="flex flex-col ">
        <label>
          <input
            type="radio"
            name="listType"
            value="bulleted"
            checked={listType === "bulleted"}
            onChange={() => setListType("bulleted")}
            className="mr-2"
          />
          Bulleted
        </label>
        <label>
          <input
            type="radio"
            name="listType"
            value="numbered"
            checked={listType === "numbered"}
            onChange={() => setListType("numbered")}
            className="mr-2"
          />
          Numbered
        </label>
      </div>

      <div class="read-only overflow-scroll w-fit max-w-80% mt-5 font-semibold block h-80 px-3 outline-none text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
        {listOfVideos.map((l) => (
          <div>{l}</div>
        ))}
      </div>
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
