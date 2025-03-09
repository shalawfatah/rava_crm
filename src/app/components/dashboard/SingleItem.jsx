import React from "react";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

const SingleItem = ({ text, icon }) => {
  return (
    <div className="flex flex-row items-center gap-4 justify-end ml-10">
      <p className={`text-xl ${rabar.className}`}>{text}</p>
      {icon}
    </div>
  );
};

export default SingleItem;
