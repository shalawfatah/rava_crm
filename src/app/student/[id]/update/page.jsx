"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "../../../components/dashboard/rabar.ttf" });

const page = () => {
  const { id } = useParams(); // Student ID
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    school: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!id) return;

    async function fetchStudentData() {
      try {
        // Fetch student details
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select("name, age, phone, school, gender, address")
          .eq("id", id)
          .single();

        if (studentError) throw studentError;

        // Fetch courses related to the student
        const { data: studentCourses, error: studentCoursesError } = await supabase
          .from("student_courses")
          .select("course_id")
          .eq("student_id", id);

        if (studentCoursesError) throw studentCoursesError;

        const studentCourseIds = studentCourses.map((sc) => sc.course_id);
        setSelectedCourses(studentCourseIds);
        setForm({
          ...student,
          age: student.age ? String(student.age) : "",
        });

        // Fetch all available courses
        const { data: allCourses, error: coursesError } = await supabase
          .from("courses")
          .select("id, name, price, discount, teachers(name), course_type(name)");

        if (coursesError) throw coursesError;

        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching student data:", error.message);
      }
    }

    fetchStudentData();
  }, [id]);

  const genders = [
    { label: "نێر", value: "male" },
    { label: "مێ", value: "female" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const studentData = { ...form, age: parseInt(form.age, 10) || null };
      await supabase.from("students").update(studentData).eq("id", id);

      // Update student courses
      await supabase.from("student_courses").delete().eq("student_id", id);
      if (selectedCourses.length > 0) {
        const newStudentCourses = selectedCourses.map((courseId) => ({
          student_id: id,
          course_id: courseId,
        }));
        await supabase.from("student_courses").insert(newStudentCourses);
      }

      router.push("/student");
    } catch (error) {
      console.error("Error updating student:", error.message);
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} shadow-md bg-linear-65 from-purple-500 to-pink-500 min-h-screen p-12 mx-auto`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">نوێکردنەوەی زانیاری خوێندکار</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputText name="name" value={form.name} onChange={handleChange} placeholder="ناو" className="p-inputtext-lg w-full" />
        <InputText name="age" value={form.age} onChange={handleChange} placeholder="تەمەن" type="number" className="p-inputtext-lg w-full" />
        <InputText name="phone" value={form.phone || ""} onChange={handleChange} placeholder="ژمارەی تەلەفۆن" className="p-inputtext-lg w-full" />
        <InputText name="school" value={form.school || ""} onChange={handleChange} placeholder="خوێندنگە" className="p-inputtext-lg w-full" />
        <InputText name="address" value={form.address || ""} onChange={handleChange} placeholder="ناونیشان" className="p-inputtext-lg w-full" />
        <Dropdown
          value={form.gender || ""}
          options={genders}
          onChange={(e) => setForm((prev) => ({ ...prev, gender: e.value }))}
          optionLabel="label"
          optionValue="value"
          placeholder="رەگەز هەڵبژێرە"
          className="w-full"
          required
        />
        <div>
          <label className="block mb-1 text-gray-700">خولەکان</label>
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-2">
              <Checkbox
                inputId={course.id}
                value={course.id}
                onChange={() => handleCourseSelect(course.id)}
                checked={selectedCourses.includes(course.id)}
              />
              <label htmlFor={course.id} className="text-gray-700">
                {`${course.name} - ${course.price} IQD - ${course.teachers?.name} - ${course.course_type.name} - داشکاندن: %${course.discount}`}
              </label>
            </div>
          ))}
        </div>
        <Button label="نوێکردنەوە" icon="pi pi-check" type="submit" loading={loading} className="p-button-primary w-full" />
      </form>
    </div>
  );
};

export default page;
