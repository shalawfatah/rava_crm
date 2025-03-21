"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "../../../components/dashboard/rabar.ttf" });

const UpdateCoursePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    price: "",
    teacher_share: "",
    discount: "",
    teacher: "",
    course_type: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch course details
        const { data: course, error: courseError } = await supabase
          .from("courses")
          .select("name, price, teacher_share, discount, teacher, course_type")
          .eq("id", id)
          .single();

        if (courseError) throw courseError;

        setForm(course);

        // Fetch teachers
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("id, name");

        if (teacherError) throw teacherError;
        setTeachers(teacherData);

        // Fetch course types
        const { data: courseTypeData, error: courseTypeError } = await supabase
          .from("course_type")
          .select("id, name");

        if (courseTypeError) throw courseTypeError;
        setCourseTypes(courseTypeData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("courses")
        .update(form)
        .eq("id", id);

      if (error) throw error;

      router.push("/course");
    } catch (error) {
      console.error("Error updating course:", error.message);
    }

    setLoading(false);
  };

  return (
    <div dir="rtl" className={`${rabar.className} min-h-screen p-12 mx-auto bg-gray-100`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">نوێکردنەوەی زانیاری خول</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputText name="name" value={form.name} onChange={handleChange} placeholder="ناو" className="p-inputtext-lg w-full" />
        <InputText name="price" value={form.price} onChange={handleChange} placeholder="نرخ" className="p-inputtext-lg w-full" />
        <InputText name="teacher_share" value={form.teacher_share} onChange={handleChange} placeholder="پشکی مامۆستا" className="p-inputtext-lg w-full" />
        <InputText name="discount" value={form.discount} onChange={handleChange} placeholder="داشکاندن" className="p-inputtext-lg w-full" />
        <Dropdown 
          name="teacher" 
          value={form.teacher} 
          options={teachers} 
          onChange={handleChange} 
          optionLabel="name" 
          optionValue="id" 
          placeholder="مامۆستای خول" 
          className="p-dropdown-lg w-full" 
        />
        <Dropdown 
          name="course_type" 
          value={form.course_type} 
          options={courseTypes} 
          onChange={handleChange} 
          optionLabel="name" 
          optionValue="id" 
          placeholder="جۆری خول" 
          className="p-dropdown-lg w-full" 
        />
        <Button label="نوێکردنەوە" icon="pi pi-check" type="submit" loading={loading} className="p-button-primary w-full" />
      </form>
    </div>
  );
};

export default UpdateCoursePage;
