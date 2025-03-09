import React from "react";
import localFont from "next/font/local";

const sarchia = localFont({ src: "./sarchia.ttf" });

function SingleStudent({ name, age }) {
  return (
    <div
      className={`${sarchia.className} text-black flex flex-wrap justify-between items-center my-6 text-xl`}
    >
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
}

export default SingleStudent;
