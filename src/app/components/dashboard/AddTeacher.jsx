"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

const AddTeacher = () => {
  const [form, setForm] = useState({ name: "", expertise: "" });
  const [courses, setCourses] = useState([]); // Store courses from DB
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("course_name")
      .select("id, name");
    if (error) console.error("Error fetching courses:", error);
    else setCourses([...data, { id: "add", name: "+ زیادکردنی پسپۆڕیی نوێ" }]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (e) => {
    if (e.value === "add") {
      router.push("/teacher/add-expertise");
    } else {
      setForm((prev) => ({ ...prev, expertise: e.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.expertise) {
      setError("تکایە خانەکان پڕبکەوە.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("teachers").insert([
      {
        name: form.name,
        expertise: form.expertise, // Save course ID
      },
    ]);

    if (error) {
      console.error("Error inserting teacher:", error.message);
      setError("هەڵەیەک ڕویدا، تکایە دووبارە هەوڵ بدە.");
    } else {
      setSuccess("مامۆستا بە سەرکەوتوویی تۆمارکرا!");
      setForm({ name: "", expertise: "" });

      setTimeout(() => setSuccess(""), 3000);
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} my-12 max-w-md mx-auto p-6 bg-white shadow-md rounded-lg`}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        تۆمارکردنی مامۆستا
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputText
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ناو"
          className="p-inputtext-lg w-full"
        />

        <Dropdown
          value={form.expertise}
          options={courses}
          onChange={handleDropdownChange}
          optionLabel="name"
          optionValue="id"
          placeholder="پسپۆڕیی هەڵبژێرە"
          className="w-full"
        />

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

export default AddTeacher;
