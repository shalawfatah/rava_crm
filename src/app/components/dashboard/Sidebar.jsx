import React from "react";
import { PiStudentFill } from "react-icons/pi";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import SingleItem from "./SingleItem";
import { SiGoogleclassroom } from "react-icons/si";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { FaToolbox } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";

function Sidebar() {
  return (
    <div className="bg-[#E59D39] border-4 border-black rounded-xl p-4 flex flex-col gap-y-4">
      <SingleItem
        text="خوێندکار"
        icon={<PiStudentFill className="text-3xl" />}
      />
      <SingleItem
        text="مامۆستا"
        icon={<PiChalkboardTeacherFill className="text-3xl" />}
      />
      <SingleItem
        text="خول"
        icon={<SiGoogleclassroom className="text-3xl" />}
      />
      <SingleItem
        text="خەرجی"
        icon={<FaHandHoldingDollar className="text-3xl" />}
      />
      <SingleItem text="سندوق" icon={<FaToolbox className="text-3xl" />} />
      <SingleItem
        text="راپۆرت"
        icon={<HiDocumentReport className="text-3xl" />}
      />
    </div>
  );
}

export default Sidebar;
