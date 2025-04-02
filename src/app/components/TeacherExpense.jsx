"use client";

import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";

const TeacherExpense = ({ visible, onHide, onSubmit }) => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    teacher: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("id, name");
      if (!error) setTeachers(data);
    };
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedValue = parseInt(rawValue || "0").toLocaleString(); // Format with commas
    setForm((prev) => ({ ...prev, amount: formattedValue }));
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="تۆمارکردنی خەرجی مامۆستا"
      className="w-[90vw] md:w-[40vw]"
      dir="rtl"
    >
      <div className="flex flex-col gap-4">
        <Dropdown
          name="teacher"
          value={form.teacher}
          options={teachers}
          onChange={handleChange}
          optionLabel="name"
          optionValue="id"
          placeholder="مامۆستا هەڵبژێرە"
          className="w-full p-dropdown-lg"
        />

        <div className="relative">
          <InputText
            name="amount"
            value={form.amount}
            onChange={handleAmountChange}
            placeholder="بڕ"
            className="w-full p-inputtext-lg"
          />
        </div>

        <InputTextarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="تێبینی"
          className="w-full p-inputtext-lg"
        />

        <div className="flex justify-end gap-2">
          <Button
            label="تۆمارکردن"
            icon="pi pi-check"
            onClick={() => onSubmit(form)}
            className="p-button-primary"
          />
          <Button
            label="رەتکردنەوە"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-secondary"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default TeacherExpense;
