"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

const RegisterStudent = () => {
  const router = useRouter(); // Initialize router
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    school: "",
    gender: "",
    address: "",
    courses: [],
  });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("id, name, price, discount, teachers(name), course_type(name)");
      if (!error) {
        setCourses(data);
      } else {
        console.error("Error fetching courses:", error.message);
      }
    }
    fetchCourses();
  }, []);

  const genders = [
    { label: "نێر", value: "male" },
    { label: "مێ", value: "female" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (courseId) => {
    setForm((prev) => {
      const updatedCourses = prev.courses.includes(courseId)
        ? prev.courses.filter((id) => id !== courseId)
        : [...prev.courses, courseId];
      return { ...prev, courses: updatedCourses };
    });
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
    } else {
      console.log("Student registered:", student);

      if (student.id && form.courses.length > 0) {
        const studentCourses = form.courses.map((courseId) => ({
          student_id: student.id,
          course_id: courseId,
        }));

        const { error: courseError } = await supabase
          .from("student_courses")
          .insert(studentCourses);
        if (courseError) {
          console.error("Error inserting student courses:", courseError.message);
        }
      }

      setForm({
        name: "",
        age: "",
        phone: "",
        school: "",
        gender: "",
        address: "",
        courses: [],
      });

      router.push("/student"); // Redirect after successful registration
    }

    setLoading(false);
  };

  return (
    <div dir="rtl" className={`${rabar.className} lg:min-w-md p-6 bg-white shadow-md rounded-lg`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">تۆمارکردنی خوێندکار</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputText name="name" value={form.name} onChange={handleChange} placeholder="ناو" className="p-inputtext-lg w-full" />
        <InputText name="age" value={form.age} onChange={handleChange} placeholder="تەمەن" type="number" className="p-inputtext-lg w-full" />
        <InputText name="phone" value={form.phone} onChange={handleChange} placeholder="ژمارەی تەلەفۆن" className="p-inputtext-lg w-full" />
        <InputText name="school" value={form.school} onChange={handleChange} placeholder="خوێندنگە" className="p-inputtext-lg w-full" />
        <InputText name="address" value={form.address} onChange={handleChange} placeholder="ناونیشان" className="p-inputtext-lg w-full" />
        <Dropdown value={form.gender} options={genders} onChange={(e) => setForm((prev) => ({ ...prev, gender: e.value }))} optionLabel="label" optionValue="value" placeholder="رەگەز هەڵبژێرە" className="w-full" required />
        <div>
          <label className="block mb-1 text-gray-700">خولەکان</label>
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-2">
              <Checkbox inputId={course.id} value={course.id} onChange={() => handleCourseSelect(course.id)} checked={form.courses.includes(course.id)} />
              <label htmlFor={course.id} className="text-gray-700">
                {`${course.name} - ${course.price} IQD - ${course.teachers?.name} - ${course.course_type.name} - داشکاندن: %${course.discount}`}
              </label>
            </div>
          ))}
        </div>
        <Button label="تۆمارکردن" icon="pi pi-check" type="submit" loading={loading} className="p-button-success w-full" />
      </form>
    </div>
  );
};

export default RegisterStudent;
