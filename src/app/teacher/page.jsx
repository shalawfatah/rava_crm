"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

const rabar = localFont({ src: "../components/dashboard/rabar.ttf" });

const TeachersTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [deleteTeacher, setDeleteTeacher] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("id, name, course_name(*)");
      if (!error) {
        setTeachers(data);
      } else {
        console.error("Error fetching teachers:", error.message);
      }
    };

    fetchTeachers();
  }, []);

  const confirmDelete = (teacher) => {
    setDeleteTeacher(teacher);
  };

  const handleDelete = async () => {
    if (!deleteTeacher) return;
    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", deleteTeacher.id);
    if (error) {
      console.error("Error deleting teacher:", error.message);
    } else {
      setTeachers((prev) => prev.filter((t) => t.id !== deleteTeacher.id));
      console.log("Teacher deleted:", deleteTeacher.id);
    }
    setDeleteTeacher(null);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-start">
        <Button
          icon="pi pi-eye"
          className="p-button-info p-button-sm"
          tooltip="بینینی زانیاری مامۆستا"
          onClick={() => router.push(`/teacher/${rowData.id}/view`)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          tooltip="نوێکردنەوەی زانیاری مامۆستا"
          onClick={() => router.push(`/teacher/${rowData.id}/update`)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          tooltip="سڕینەوەی مامۆستا"
          onClick={() => confirmDelete(rowData)}
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
        <div className="flex items-center gap-4">
          <Button
            label="تۆمارکردنی مامۆستای نوێ"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => router.push("/teacher/add-teacher")}
          />
          <Button
            label="تۆمارکردنی پسپۆڕیی"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => router.push("/teacher/add-expertise")}
          />
        </div>
      </div>
      <DataTable
        value={teachers}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        className="rtl-table"
        tableStyle={{ minWidth: "40rem", textAlign: "right" }}
      >
        <Column
          field="name"
          header="ناو"
          style={{ width: "40%", textAlign: "right" }}
        />
        <Column
          field="course_name.name"
          header="پسپۆڕیی"
          style={{ width: "40%", textAlign: "right" }}
        />
        <Column
          header="کار"
          body={actionBodyTemplate}
          style={{ width: "20%" }}
        />
      </DataTable>
      {/* Confirmation Dialog */}
      <Dialog
        visible={!!deleteTeacher}
        onHide={() => setDeleteTeacher(null)}
        header="سڕینەوەی مامۆستا"
        footer={
          <div>
            <Button
              label="پاشگەزبوونەوە"
              onClick={() => setDeleteTeacher(null)}
              className="p-button-text"
            />
            <Button
              label="سڕینەوە"
              onClick={handleDelete}
              className="p-button-danger"
              autoFocus
            />
          </div>
        }
      >
        {deleteTeacher && <p>دەتەوێت مامۆستا {deleteTeacher.name} بسڕیتەوە؟</p>}
      </Dialog>
    </div>
  );
};

export default TeachersTable;
