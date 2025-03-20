"use client";

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

const AddTeacher = () => {
  const [form, setForm] = useState({ name: "", expertise: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.expertise.trim()) {
      setError("تکایە خانەکان پڕبکەوە.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("teachers").insert([form]);

    if (error) {
      console.error("Error inserting teacher:", error.message);
      setError("هەڵەیەک ڕویدا، تکایە دووبارە هەوڵ بدە.");
    } else {
      console.log("Teacher registered:", data);
      setSuccess("مامۆستا بە سەرکەوتوویی تۆمارکرا!");
      setForm({ name: "", expertise: "" });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} my-12 max-w-md mx-auto p-6 bg-white shadow-md rounded-lg`}
    >
      <h2 className="text-xl font-semibold mb-4">تۆمارکردنی مامۆستا</h2>

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
        <InputText
          name="expertise"
          value={form.expertise}
          onChange={handleChange}
          placeholder="پسپۆڕیی"
          className="p-inputtext-lg w-full"
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
