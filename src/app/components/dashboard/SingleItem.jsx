import React from "react";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

const SingleItem = ({ text, icon }) => {
  return (
    <div className="flex flex-row items-center gap-4 ml-10">
      {icon}
      <p className={`text-xl ${rabar.className}`}>{text}</p>
    </div>
  );
};

export default SingleItem;
