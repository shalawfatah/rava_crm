"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import localFont from "next/font/local";

const rabar = localFont({ src: "../../components/dashboard/rabar.ttf" });

const CourseNamePage = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [editCourse, setEditCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from("course_name").select("*");
    if (error) console.error("Error fetching courses:", error);
    else setCourses(data);
  };

  const handleAddCourse = async () => {
    if (!courseName.trim()) return;
    const { error } = await supabase
      .from("course_name")
      .insert([{ name: courseName }]);
    if (error) console.error("Error adding course:", error);
    else {
      setCourseName("");
      fetchCourses();
    }
  };

  const handleDeleteCourse = async (id) => {
    const { error } = await supabase.from("course_name").delete().eq("id", id);
    if (error) console.error("Error deleting course:", error);
    else fetchCourses();
  };

  const handleEditCourse = async () => {
    if (!editCourse.name.trim()) return;
    const { error } = await supabase
      .from("course_name")
      .update({ name: editCourse.name })
      .eq("id", editCourse.id);
    if (error) console.error("Error updating course:", error);
    else {
      setModalVisible(false);
      setEditCourse(null);
      fetchCourses();
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "ئایا دڵنیایت لە سڕینەوە؟",
      header: "سڕینەوە",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "بەڵێ",
      rejectLabel: "نەخێر",
      accept: () => handleDeleteCourse(id),
    });
  };

  return (
    <div
      dir="rtl"
      className={`${rabar.className} p-5 min-h-screen bg-gradient-to-b from-gray-200 to-gray-400`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-right text-gray-700">
        پەڕەی پسپۆڕییەکان
      </h2>

      <div className="flex gap-2 mb-4">
        <InputText
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="ناوی پسپۆڕیی بنووسە"
        />
        <Button
          label="زیادکردن"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={handleAddCourse}
        />
      </div>

      <DataTable value={courses} responsiveLayout="scroll">
        <Column
          field="name"
          header="ناوی پسپۆڕیی"
          body={(rowData) => <div className="text-right">{rowData.name}</div>}
        />
        <Column
          header="کار"
          body={(rowData) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={() => {
                  setEditCourse(rowData);
                  setModalVisible(true);
                }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => confirmDelete(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      <ConfirmDialog />

      {/* Edit Course Modal */}
      <Dialog
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        header="گۆڕینی پسپۆڕیی"
        modal
      >
        <div className="flex flex-col gap-3">
          <InputText
            value={editCourse?.name || ""}
            onChange={(e) =>
              setEditCourse({ ...editCourse, name: e.target.value })
            }
          />
          <Button
            label="تازەکردنەوە"
            icon="pi pi-check"
            className="p-button-primary"
            onClick={handleEditCourse}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default CourseNamePage;
