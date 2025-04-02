"use client";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "../../components/dashboard/rabar.ttf" });

const Page = () => {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [newCohortName, setNewCohortName] = useState("");

  useEffect(() => {
    async function fetchCohorts() {
      const { data, error } = await supabase.from("cohort").select("id, name");
      if (error) console.error("Error fetching cohorts:", error);
      else setCohorts(data);
    }
    fetchCohorts();
  }, []);

  const openDeleteModal = (cohort) => {
    setSelectedCohort(cohort);
    setDeleteModalVisible(true);
  };

  const openUpdateModal = (cohort) => {
    setSelectedCohort(cohort);
    setUpdatedName(cohort.name);
    setUpdateModalVisible(true);
  };

  const openAddModal = () => {
    setNewCohortName("");
    setAddModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedCohort) return;
    await supabase.from("cohort").delete().eq("id", selectedCohort.id);
    setCohorts(cohorts.filter((c) => c.id !== selectedCohort.id));
    setDeleteModalVisible(false);
  };

  const handleUpdate = async () => {
    if (!selectedCohort) return;
    await supabase.from("cohort").update({ name: updatedName }).eq("id", selectedCohort.id);
    setCohorts(cohorts.map((c) => (c.id === selectedCohort.id ? { ...c, name: updatedName } : c)));
    setUpdateModalVisible(false);
  };

  const handleAdd = async () => {
    if (!newCohortName.trim()) return;
    const { data, error } = await supabase.from("cohort").insert([{ name: newCohortName }]).select("id, name");
    if (error) return console.error("Error adding cohort:", error);
    setCohorts([...cohorts, ...data]);
    setAddModalVisible(false);
  };

  return (
    <div dir="rtl" className={`${rabar.className} mx-auto my-12 p-4 border rounded-lg shadow-lg bg-white w-full max-w-md`}>
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">ناوی گروپ</h2>
      <Button label="زیادکردنی گروپ" icon="pi pi-plus" className="p-button-success mb-4 w-full" onClick={openAddModal} />
      <ul className="list-disc pl-5">
        {cohorts.map((cohort) => (
          <li key={cohort.id} className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">{cohort.name}</span>
            <div>
              <Button tooltip="نوێکردنەوە" icon="pi pi-pencil" className="p-button-text p-button-warning mr-2" onClick={() => openUpdateModal(cohort)} />
              <Button tooltip="سڕینەوە" icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => openDeleteModal(cohort)} />
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      <Dialog visible={isDeleteModalVisible} onHide={() => setDeleteModalVisible(false)} header="سڕینەوە">
        <p>ئایا دڵنیایت لە سڕینەوەی {selectedCohort?.name}؟</p>
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

      {/* Add Cohort Modal */}
      <Dialog visible={isAddModalVisible} onHide={() => setAddModalVisible(false)} header="زیادکردنی گروپ">
        <InputText value={newCohortName} onChange={(e) => setNewCohortName(e.target.value)} className="w-full" placeholder="ناوی گروپ بنووسە" />
        <div className="flex justify-end mt-4">
          <Button label="پاشگەزبوونەوە" onClick={() => setAddModalVisible(false)} className="p-button-text" />
          <Button label="زیادکردن" className="p-button-success ml-2" onClick={handleAdd} />
        </div>
      </Dialog>
    </div>
  );
};

export default Page;
