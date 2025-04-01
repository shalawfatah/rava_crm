"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const rabar = localFont({ src: "../components/dashboard/rabar.ttf" });

const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(
          "id, course_name(*), price, teacher_share, discount, teacher(id, name), course_type(id, name), cohort(id, name)",
        );
      if (!error) {
        setCourses(data);
      } else {
        console.error("Error fetching courses:", error.message);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (id) => {
    router.push(`/course/${id}/update`);
  };

  const handleView = (id) => {
    router.push(`/course/${id}/view`);
  };

  const handleDelete = (id) => {
    confirmDialog({
      message: "دەتەوێت ئەم خولە بسڕیتەوە؟",
      header: "سڕینەوەی خول",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "بەڵێ",
      rejectLabel: "نەخێر",
      accept: async () => {
        const { error } = await supabase.from("courses").delete().eq("id", id);
        if (error) {
          console.error("Error deleting course:", error.message);
        } else {
          setCourses((prev) => prev.filter((course) => course.id !== id));
          console.log("Course deleted:", id);
        }
      },
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-start">
        <Button
          icon="pi pi-eye"
          className="p-button-info p-button-sm"
          tooltip="بینینی زانیاری خول"
          onClick={() => handleView(rowData.id)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          tooltip="نوێکردنەوەی زانیاری خول"
          onClick={() => handleEdit(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          tooltip="سڕینەوەی خول"
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
      <ConfirmDialog />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 text-right">
          لیستی خولەکان
        </h2>
        <Button
          label="تۆمارکردنی خولی نوێ"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={() => router.push("/course/add-course")}
        />
      </div>
      <DataTable
        value={courses}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="rtl-table"
        tableStyle={{ minWidth: "50rem", textAlign: "right" }}
      >
        <Column
          field="course_name.name"
          header="ناو"
          style={{ width: "20%", textAlign: "right" }}
        />
        <Column
          field="price"
          header="نرخ"
          style={{ width: "15%", textAlign: "right" }}
        />
        <Column
          field="teacher_share"
          header="پشکی مامۆستا"
          body={(rowData) => `${rowData.teacher_share}%`}
          style={{ width: "15%", textAlign: "right" }}
        />
        <Column
          field="discount"
          header="داشکاندن"
          body={(rowData) => `${rowData.discount}%`}
          style={{ width: "15%", textAlign: "right" }}
        />
        <Column
          field="teacher.name"
          header="مامۆستای خول"
          style={{ width: "20%", textAlign: "right" }}
        />
        <Column
          field="course_type.name"
          header="جۆری خول"
          style={{ width: "15%", textAlign: "right" }}
        />
        <Column
          field="cohort.name"
          header="گروپ"
          style={{ width: "15%", textAlign: "right" }}
        />

        <Column
          header="کار"
          body={actionBodyTemplate}
          style={{ width: "15%" }}
        />
      </DataTable>
    </div>
  );
};

export default CoursesTable;
