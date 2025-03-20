"use client"
import RegisterStudent from "@/app/components/dashboard/RegisterStudent";
import React from "react";

function AddStudent() {
  return (
    <div className="bg-linear-65 from-purple-500 to-pink-500 min-h-screen flex justify-center items-center">
      <RegisterStudent />
    </div>
  );
}

export default AddStudent;
