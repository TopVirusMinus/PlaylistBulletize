import React from "react";
const Navbar = () => {
  return (
    <div className=" flex items-center  p-2 gap-4 border-b-2 border-b-gray-200 select-none mb-11">
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 24 24"
        height="3em"
        width="3em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path fill="none" d="M0 0H24V24H0z"></path>
          <path d="M22 18v2H2v-2h20zM2 3.5l8 5-8 5v-10zM22 11v2H12v-2h10zm0-7v2H12V4h10z"></path>
        </g>
      </svg>
      <a href="/" className="font-bold text-4xl	tracking-tight cursor-pointer">
        PlaylistBulletize
      </a>
    </div>
  );
};

export default Navbar;
