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

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("id, name, age, phone");
      if (!error) {
        setStudents(data);
      } else {
        console.error("Error fetching students:", error.message);
      }
    };

    fetchStudents();
  }, []);

  const handleEdit = (id) => {
    router.push(`/student/${id}/update`);
  };

  const handleView = (id) => {
    router.push(`/student/${id}/view`);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDialogVisible(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      const { error } = await supabase.from("students").delete().eq("id", deleteId);
      if (error) {
        console.error("Error deleting student:", error.message);
      } else {
        setStudents((prev) => prev.filter((student) => student.id !== deleteId));
        console.log("Student deleted:", deleteId);
      }
    }
    setIsDialogVisible(false);
    setDeleteId(null);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-start ">
        <Button
          icon="pi pi-eye"
          className="p-button-info p-button-sm"
          tooltip="بینینی پرۆفایلی خوێندکار"
          onClick={() => handleView(rowData.id)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          tooltip="نوێکردنەوەی پرۆفایلی خوێندکار"
          onClick={() => handleEdit(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          tooltip="سڕینەوەی پرۆفایلی خوێندکار"
          onClick={() => confirmDelete(rowData.id)}
        />
      </div>
    );
  };

  return (
    <div
      className={`${rabar.className} p-4 bg-white shadow-md bg-linear-65 from-purple-500 to-pink-500 min-h-screen`}
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 text-right">
          لیستی خوێندکاران
        </h2>
        <Button
          label="تۆمارکردنی خوێندکاری نوێ"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={() => router.push("/student/add-student")}
        />
      </div>
      <DataTable
        value={students}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="rtl-table"
        tableStyle={{ minWidth: "40rem", textAlign: "right" }}
      >
        <Column
          field="name"
          header="ناو"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          field="age"
          header="تەمەن"
          style={{ width: "20%", textAlign: "right" }}
        />
        <Column
          field="phone"
          header="تەلەفۆن"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          header="کار"
          body={actionBodyTemplate}
          style={{ width: "20%" }}
        />
      </DataTable>
      {/* Confirmation Dialog */}
      <Dialog
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        header="دڵنیای؟"
        footer={
          <div>
            <Button label="نەخێر" onClick={() => setIsDialogVisible(false)} className="p-button-text" />
            <Button label="بەڵێ" onClick={handleDelete} className="p-button-danger" />
          </div>
        }
      >
        <p>ئایە دڵنیایت لە سڕینەوەی ئەم خوێندکارە؟</p>
      </Dialog>
    </div>
  );
};

export default StudentsTable;
