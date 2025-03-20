"use client";

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

const AddCourseType = () => {
  const [form, setForm] = useState({ name: "", price: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.name.trim() || form.price <= 0) {
      setError("تکایە خانەکان پڕبکەوە و نرخی دروست دابنێ.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("course_type").insert([
      { name: form.name, price: form.price },
    ]);

    if (error) {
      setError("هەڵەیەک ڕویدا، تکایە دووبارە هەوڵ بدە.");
    } else {
      setSuccess("جۆر بە سەرکەوتوویی زیاد کرا!");
      setForm({ name: "", price: 0 });
      setTimeout(() => setSuccess(""), 3000);
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} my-12 max-w-md mx-auto p-6 bg-white shadow-md rounded-lg`}
    >
      <h2 className="text-xl font-semibold mb-4">زیادکردنی جۆری خوێندنی</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputText
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="جۆر"
          className="p-inputtext-lg w-full"
        />
        <InputText
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="نرخ"
          type="number"
          min="0"
          step="any"
          className="p-inputtext-lg w-full"
        />
        <Button
          label="زیادکردن"
          icon="pi pi-check"
          type="submit"
          loading={loading}
          className="p-button-success w-full"
        />
      </form>
    </div>
  );
};

export default AddCourseType;
