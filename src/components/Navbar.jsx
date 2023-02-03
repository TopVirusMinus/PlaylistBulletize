import React from "react";
import { RiPlayList2Fill } from "react-icons/RI";
const Navbar = () => {
  return (
    <div className=" flex items-center p-2 gap-4 border-b-2 border-b-gray-200 select-none mb-11">
      <RiPlayList2Fill size={50} />
      <a href="/" className="font-bold text-4xl	tracking-tight cursor-pointer">
        PlaylistBulletize
      </a>
    </div>
  );
};

export default Navbar;
