import React from 'react'
import SingleBox from './SingleBox'
import { PiStudent } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";

const Boxes = () => {
  return (
    <div dir="rtl" className='flex flex-row gap-12 flex-wrap'>
      <SingleBox
        text="خوێندکاران"
        icon={<PiStudent className='text-3xl' />}
        number={"٣٢"}
      />
      <SingleBox
        text="خولەکان"
        icon={<SiGoogleclassroom className='text-3xl' />}
        number={"٨"}
      />
       <SingleBox
        text="مامۆستا"
        icon={<FaChalkboardTeacher className='text-3xl' />}
        number={"١٢"}
      />
       <SingleBox
        text="داهات"
        icon={<FaSackDollar className='text-3xl' />}
        number={"١٣،٢٤٨،٠٠٠"}
      />
 
    </div>
  )
}

export default Boxes
