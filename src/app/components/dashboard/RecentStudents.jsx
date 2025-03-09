"use client"
import React, { useEffect, useState } from "react";
import localFont from "next/font/local";
import { supabase } from "@/app/utils/supabase/client";
import SingleStudent from "./SingleStudent";

const rabar = localFont({ src: "./rabar.ttf" });

function RecentStudents() {

  const [students, setStudents] = useState([]);

  const fetcher = async () => {
    const { data, error} = await supabase.from("students").select().limit(10);
    if(error) {
      throw Error(error.message)
    }
    console.log(data)
    setStudents(data);
  };

  useEffect(() => {
    fetcher();
  }, []);

  return (
    <div className={`${rabar.className} bg-[#CFE2E7] my-6 rounded-2xl p-6`}>
      <h2 className={`text-black text-3xl`}>خوێندکارانی ئەم دواییە</h2>
      {students.map(item => {
        return <div key={item.id}><SingleStudent name={item.name} age={item.age} /></div>
      })}
    </div>
  );
}

export default RecentStudents;
