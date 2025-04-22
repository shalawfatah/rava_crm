import React from 'react';
import { FaDollarSign } from 'react-icons/fa';
import localFont from "next/font/local";

const rabar = localFont({ src: "../dashboard/rabar.ttf" });


const GeneralCard = ({title, amount, progress, children, color}) => {
  return (
    <div className={`${rabar.className} p-4 bg-white shadow-lg min-w-xs rounded-2xl`}>
      <div className="flex items-center">
        <span className={`${color} relative p-2 w-6 h-6 rounded-full flex items-center justify-center`}>
          <FaDollarSign className="text-white text-sm" />
        </span>
        <p className="m-2 text-gray-700 text-lg">{title}</p>
        <p className="ml-2 text-green-700 font-semibold flex items-center">
          {children}
        </p>
      </div>
      <div className="flex flex-col justify-start">
        <p className="mt-4 mb-4 text-gray-800 text-3xl font-bold text-left">{amount}</p>
        <div className="relative bg-gray-200 w-full h-2 rounded-md">
          <div className={`${progress} absolute top-0 left-0 h-full rounded-md ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default GeneralCard;
