import React from "react";
import localFont from 'next/font/local'

const rabar = localFont({ src: './rabar.ttf' })

function SingleBox({ text, icon, number }) {
  return (
    <div className={`${rabar.className} bg-[#CFE2E7] text-black flex flex-col items-center p-4 rounded-2xl min-w-48 max-h-48 shadow-md`}>
      <p className="text-3xl">{text}</p>
      {icon}
      <p className="text-3xl">{number}</p>
    </div>
  );
}

export default SingleBox;
