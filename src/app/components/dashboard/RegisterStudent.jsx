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

  const [selectedCourses, setSelectedCourses] = useState({});
  const [loading, setLoading] = useState(false);

  const genders = [
    { label: "نێر", value: "male" },
    { label: "مێ", value: "female" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (courses) => {
    setSelectedCourses(courses);
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
      .select()
      .single();

    if (error) {
      console.error("Error inserting student:", error.message);
      setLoading(false);
      return;
    }

    // Extract course_id values
    const courseIds = Object.values(selectedCourses)
      .map((course) => course.course_id)
      .filter(Boolean); // Filter out undefined/null

    // If using a junction table for student-course relationships
    if (courseIds.length > 0) {
      const studentCourses = courseIds.map((course_id) => ({
        student_id: student.id,
        course_id,
      }));

      const { error: linkError } = await supabase
        .from("student_courses") // Change to your actual join table name
        .insert(studentCourses);

      if (linkError) {
        console.error("Error linking student to courses:", linkError.message);
        // Optionally rollback student if needed
      }
    }

    setForm({
      name: "",
      age: "",
      phone: "",
      school: "",
      gender: "",
      address: "",
    });

    setSelectedCourses({});
    setLoading(false);
    router.push("/student");
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

        <CoursePick onCourseChange={handleCourseChange} />

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
