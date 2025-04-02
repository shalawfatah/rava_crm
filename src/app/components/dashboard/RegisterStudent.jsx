"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import CoursePick from "./CoursePick";

const rabar = localFont({ src: "./rabar.ttf" });

const RegisterStudent = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    school: "",
    gender: "",
    address: "",
  });
  const [selectedCourses, setSelectedCourses] = useState([]); // Store selected course IDs
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null); // Track the student ID after registration

  const genders = [
    { label: "نێر", value: "male" },
    { label: "مێ", value: "female" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const studentData = {
      name: form.name,
      age: parseInt(form.age, 10) || null,
      phone: form.phone,
      school: form.school,
      gender: form.gender,
      address: form.address,
    };

    const { data: student, error } = await supabase
      .from("students")
      .insert([studentData])
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting student:", error.message);
      setLoading(false);
      return;
    }

    setStudentId(student.id); // Store the student ID after successful registration

    setForm({
      name: "",
      age: "",
      phone: "",
      school: "",
      gender: "",
      address: "",
    });

    router.push("/student");
    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} lg:min-w-md p-6 bg-white shadow-md rounded-lg`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        تۆمارکردنی خوێندکار
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputText
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ناو"
          className="p-inputtext-lg w-full"
        />
        <InputText
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="تەمەن"
          type="number"
          className="p-inputtext-lg w-full"
        />
        <InputText
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="ژمارەی تەلەفۆن"
          className="p-inputtext-lg w-full"
        />
        <InputText
          name="school"
          value={form.school}
          onChange={handleChange}
          placeholder="خوێندنگە"
          className="p-inputtext-lg w-full"
        />
        <InputText
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="ناونیشان"
          className="p-inputtext-lg w-full"
        />
        <Dropdown
          value={form.gender}
          options={genders}
          onChange={(e) => setForm((prev) => ({ ...prev, gender: e.value }))}
          optionLabel="label"
          optionValue="value"
          placeholder="رەگەز هەڵبژێرە"
          className="w-full"
          required
        />
        <CoursePick studentId={studentId} />{" "}
        {/* Pass studentId to CoursePick */}
        <Button
          label="تۆمارکردن"
          icon="pi pi-check"
          type="submit"
          loading={loading}
          className="p-button-success w-full"
        />
      </form>
    </div>
  );
};

export default RegisterStudent;
