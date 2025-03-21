"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

const rabar = localFont({ src: "../components/dashboard/rabar.ttf" });

const TeachersTable = () => {
  const [teachers, setTeachers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("id, name, expertise");
      if (!error) {
        setTeachers(data);
      } else {
        console.error("Error fetching teachers:", error.message);
      }
    };

    fetchTeachers();
  }, []);

  const handleEdit = (id) => {
    router.push(`/teacher/${id}/update`);
  };

  const handleView = (id) => {
    router.push(`/teacher/${id}/view`);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting teacher:", error.message);
    } else {
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
      console.log("Teacher deleted:", id);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-start">
        <Button
          icon="pi pi-eye"
          className="p-button-info p-button-sm"
          tooltip="بینینی زانیاری مامۆستا"
          onClick={() => handleView(rowData.id)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          tooltip="نوێکردنەوەی زانیاری مامۆستا"
          onClick={() => handleEdit(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          tooltip="سڕینەوەی مامۆستا"
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  return (
    <div
      className={`${rabar.className} p-4 bg-white shadow-md bg-linear-65 from-blue-500 to-green-500 min-h-screen`}
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 text-right">
          لیستی مامۆستایان
        </h2>
        <Button
          label="تۆمارکردنی مامۆستای نوێ"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={() => router.push("/teacher/add-teacher")}
        />
      </div>
      <DataTable
        value={teachers}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="rtl-table"
        tableStyle={{ minWidth: "40rem", textAlign: "right" }}
      >
        <Column
          field="name"
          header="ناو"
          style={{ width: "40%", textAlign: "right" }}
        />
        <Column
          field="expertise"
          header="تخصص"
          style={{ width: "40%", textAlign: "right" }}
        />
        <Column
          header="کار"
          body={actionBodyTemplate}
          style={{ width: "20%" }}
        />
      </DataTable>
    </div>
  );
};

export default TeachersTable;
