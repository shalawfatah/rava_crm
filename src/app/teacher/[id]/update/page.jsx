"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "../../../components/dashboard/rabar.ttf" });

const UpdateTeacherPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", expertise: "" });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        // Fetch teacher data
        const { data: teacher, error: teacherError } = await supabase
          .from("teachers")
          .select("name, expertise, course_name(name, id)")
          .eq("id", id)
          .single();

        if (teacherError) throw teacherError;

        setForm({
          name: teacher.name,
          expertise: teacher.course_name?.id || "",
        });

        // Fetch courses
        const { data: courseList, error: courseError } = await supabase
          .from("course_name")
          .select("id, name");

        if (courseError) throw courseError;
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    fetchData();
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
        .from("teachers")
        .update({
          name: form.name,
          expertise: form.expertise,
        })
        .eq("id", id);

      if (error) throw error;

      router.push("/teacher");
    } catch (error) {
      console.error("Error updating teacher:", error.message);
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} min-h-screen p-12 mx-auto bg-gray-100`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        نوێکردنەوەی زانیاری مامۆستا
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputText
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ناو"
          className="p-inputtext-lg w-full"
        />
        <Dropdown
          name="expertise"
          value={form.expertise}
          options={courses.map((course) => ({
            label: course.name,
            value: course.id,
          }))}
          onChange={(e) => setForm((prev) => ({ ...prev, expertise: e.value }))}
          placeholder="پسپۆری"
          className="w-full"
        />
        <Button
          label="نوێکردنەوە"
          icon="pi pi-check"
          type="submit"
          loading={loading}
          className="p-button-primary w-full"
        />
      </form>
    </div>
  );
};

export default UpdateTeacherPage;
