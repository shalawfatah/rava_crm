"use client";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

export default function AddCourse() {
  const [formData, setFormData] = useState({
    name: "",
    price: null,
    course_type: null,
    teacher: null,
    teacher_share: null,
    discount: null,
    cohort: null,
  });
  const [courseTypes, setCourseTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [
        { data: courseData, error: courseError },
        { data: teacherData, error: teacherError },
        { data: cohortData, error: cohortError }
      ] = await Promise.all([
        supabase.from("course_type").select("id, name"),
        supabase.from("teachers").select("id, name"),
        supabase.from("cohort").select("id, name"),
      ]);

      if (courseError) console.error("Error fetching course types:", courseError);
      else setCourseTypes(courseData);

      if (teacherError) console.error("Error fetching teachers:", teacherError);
      else setTeachers(teacherData);

      if (cohortError) console.error("Error fetching cohorts:", cohortError);
      else setCohorts(cohortData);
    }

    fetchData();
  }, []);

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target ? e.target.value : e.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("courses").insert([formData]);
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: "هەڵەیەک ڕویدا: " + error.message });
    } else {
      setMessage({ type: "success", text: "خولەکە بە سەرکەوتوویی تۆمارکرا!" });
      setFormData({ name: "", price: null, course_type: null, teacher: null, teacher_share: null, discount: null, cohort: null });
    }
  };

  return (
    <div dir="rtl" className={`${rabar.className} mx-auto my-12 p-4 border rounded-lg shadow-lg bg-white w-full max-w-md`}>
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">تۆمارکردنی خول</h2>
      {message && <Message severity={message.type} text={message.text} className="mb-3" />}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 text-gray-700">ناو</label>
          <InputText value={formData.name} onChange={(e) => handleChange(e, "name")} className="w-full" required />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">نرخ</label>
          <InputNumber value={formData.price} onChange={(e) => handleChange(e, "price")} className="w-full" required />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">جۆری خول</label>
          <Dropdown
            value={formData.course_type}
            options={courseTypes}
            onChange={(e) => handleChange(e, "course_type")}
            optionLabel="name"
            optionValue="id"
            placeholder="جۆری خول هەڵبژێرە"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">مامۆستا</label>
          <Dropdown
            value={formData.teacher}
            options={teachers}
            onChange={(e) => handleChange(e, "teacher")}
            optionLabel="name"
            optionValue="id"
            placeholder="مامۆستا هەڵبژێرە"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">گروپ</label>
          <Dropdown
            value={formData.cohort}
            options={cohorts}
            onChange={(e) => handleChange(e, "cohort")}
            optionLabel="name"
            optionValue="id"
            placeholder="گروپ هەڵبژێرە"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">پشکی مامۆستا</label>
          <InputNumber
            value={formData.teacher_share}
            onChange={(e) => handleChange(e, "teacher_share")}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">داشکاندن</label>
          <InputNumber
            value={formData.discount}
            onChange={(e) => handleChange(e, "discount")}
            className="w-full"
            required
          />
        </div>
        <Button
          type="submit"
          label="تۆمارکردن"
          icon="pi pi-check"
          loading={loading}
          className="p-button-success w-full"
        />
      </form>
    </div>
  );
}
