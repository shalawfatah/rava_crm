"use client";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "../../components/dashboard/rabar.ttf" });

const Page = () => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [newCourseName, setNewCourseName] = useState("");

  useEffect(() => {
    async function fetchCourseTypes() {
      const { data, error } = await supabase.from("course_type").select("id, name");
      if (error) console.error("Error fetching course types:", error);
      else setCourseTypes(data);
    }
    fetchCourseTypes();
  }, []);

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setDeleteModalVisible(true);
  };

  const openUpdateModal = (course) => {
    setSelectedCourse(course);
    setUpdatedName(course.name);
    setUpdateModalVisible(true);
  };

  const openAddModal = () => {
    setNewCourseName("");
    setAddModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    await supabase.from("course_type").delete().eq("id", selectedCourse.id);
    setCourseTypes(courseTypes.filter((c) => c.id !== selectedCourse.id));
    setDeleteModalVisible(false);
  };

  const handleUpdate = async () => {
    if (!selectedCourse) return;
    await supabase.from("course_type").update({ name: updatedName }).eq("id", selectedCourse.id);
    setCourseTypes(courseTypes.map((c) => (c.id === selectedCourse.id ? { ...c, name: updatedName } : c)));
    setUpdateModalVisible(false);
  };

  const handleAdd = async () => {
    if (!newCourseName.trim()) return;
    const { data, error } = await supabase.from("course_type").insert([{ name: newCourseName }]).select("id, name");
    if (error) return console.error("Error adding course type:", error);
    setCourseTypes([...courseTypes, ...data]);
    setAddModalVisible(false);
  };

  return (
    <div dir="rtl" className={`${rabar.className} mx-auto my-12 p-4 border rounded-lg shadow-lg bg-white w-full max-w-md`}>
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">جۆری خول</h2>
      <Button label="جۆری خول زیادکردن" icon="pi pi-plus" className="p-button-success mb-4 w-full" onClick={openAddModal} />
      <ul className="list-disc pl-5">
        {courseTypes.map((course) => (
          <li key={course.id} className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">{course.name}</span>
            <div>
              <Button tooltip="نوێکردنەوە" icon="pi pi-pencil" className="p-button-text p-button-warning mr-2" onClick={() => openUpdateModal(course)} />
              <Button tooltip="سڕینەوە" icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => openDeleteModal(course)} />
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      <Dialog visible={isDeleteModalVisible} onHide={() => setDeleteModalVisible(false)} header="سڕینەوە">
        <p>ئایا دڵنیایت لە سڕینەوەی {selectedCourse?.name}؟</p>
        <div className="flex justify-end mt-4">
          <Button label="نەخێر" onClick={() => setDeleteModalVisible(false)} className="p-button-text" />
          <Button label="بەڵێ" className="p-button-danger ml-2" onClick={handleDelete} />
        </div>
      </Dialog>

      {/* Update Name Modal */}
      <Dialog visible={isUpdateModalVisible} onHide={() => setUpdateModalVisible(false)} header="دەستکاری ناو">
        <InputText value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} className="w-full" />
        <div className="flex justify-end mt-4">
          <Button label="پاشگەزبوونەوە" onClick={() => setUpdateModalVisible(false)} className="p-button-text" />
          <Button label="تازەکردنەوە" className="p-button-success ml-2" onClick={handleUpdate} />
        </div>
      </Dialog>

      {/* Add Course Type Modal */}
      <Dialog visible={isAddModalVisible} onHide={() => setAddModalVisible(false)} header="جۆری خول زیادکردن">
        <InputText value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} className="w-full" placeholder="ناوی جۆری خول بنووسە" />
        <div className="flex justify-end mt-4">
          <Button label="پاشگەزبوونەوە" onClick={() => setAddModalVisible(false)} className="p-button-text" />
          <Button label="زیادکردن" className="p-button-success ml-2" onClick={handleAdd} />
        </div>
      </Dialog>
    </div>
  );
};

export default Page;
