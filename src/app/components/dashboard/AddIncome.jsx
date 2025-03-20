"use client";

import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "./rabar.ttf" });

const AddIncome = () => {
  const [form, setForm] = useState({
    student_id: null,
    amount: "",
    source: "",
  });
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("id, name");
      if (!error) setStudents(data || []);
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value === null ? "" : value,
      ...(name === "source" ? { student_id: null } : {}), // Set student_id to null when typing in source
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure correct data structure
    const incomeData = {
      student_id: form.student_id || null,
      amount: parseInt(form.amount) || 0,
      source: form.student_id ? null : form.source.trim() || null,
    };

    // **Fix: Prevent submission if both student_id and source are null**
    if (!incomeData.student_id && !incomeData.source) {
      console.error("Error: Either student_id or source must be provided.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("income").insert([incomeData]);
    if (error) {
      console.error("Error inserting income:", error.message);
    } else {
      console.log("Income registered:", data);
      setForm({ student_id: null, amount: "", source: "" }); // Reset form
    }
    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} my-12 max-w-md mx-auto p-6 bg-white shadow-md rounded-lg`}
    >
      <h2 className="text-xl font-semibold mb-4">تۆمارکردنی داهات</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Dropdown
          name="student_id"
          value={form.student_id}
          options={[
            { label: "None", value: null },
            ...students.map((s) => ({ label: s.name, value: s.id })),
          ]}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              student_id: e.value,
              source: e.value ? "" : prev.source, // Clear source when selecting a student
            }))
          }
          placeholder="پارەی خوێندکار"
          className="w-full"
        />
        <InputText
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="بڕی پارە"
          type="number"
          className="p-inputtext-lg w-full"
        />
        {!form.student_id && (
          <InputText
            name="source"
            value={form.source}
            onChange={handleChange}
            placeholder="سەرچاوەی داهات"
            className="p-inputtext-lg w-full"
          />
        )}
        <Button
          label="تۆمارکردنی داهات"
          icon="pi pi-check"
          type="submit"
          loading={loading}
          className="p-button-success w-full"
        />
      </form>
    </div>
  );
};

export default AddIncome;
