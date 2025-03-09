import React from "react";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

function SingleStudent({ name, age }) {
  return (
    <div
      className={`${rabar.className} text-black flex flex-wrap justify-between items-center`}
    >
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
}

export default SingleStudent;
