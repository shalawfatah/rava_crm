"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import Installment from "@/app/components/Installment"; // Import Installment Dialog
import OtherIncome from "@/app/components/OtherIncome";

const rabar = localFont({ src: "../components/dashboard/rabar.ttf" });

const IncomeTable = () => {
  const [income, setIncome] = useState([]);
  const [isInstallmentVisible, setIsInstallmentVisible] = useState(false); // State for dialog
  const [showOtherIncomeDialog, setShowOtherIncomeDialog] = useState(false);
  const router = useRouter();
  const fetchIncome = async () => {
    const { data, error } = await supabase
      .from("income")
      .select("id, amount, source, student_id, students(name)")
      .order("id", { ascending: false });

    if (!error) {
      setIncome(data);
    } else {
      console.error("Error fetching income:", error.message);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("income").delete().eq("id", id);
    if (error) {
      console.error("Error deleting income:", error.message);
    } else {
      setIncome((prev) => prev.filter((item) => item.id !== id));
      console.log("Income deleted:", id);
    }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "دەتەوێت ئەم داهاتە بسڕیتەوە؟",
      header: "سڕینەوەی داهات",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "بەڵێ",
      rejectLabel: "نەخێر",
      accept: () => handleDelete(id),
    });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-start">
      <Button
        icon="pi pi-eye"
        className="p-button-info p-button-sm"
        tooltip="بینین"
        onClick={() => router.push(`/income/${rowData.id}/view`)}
      />
      <Button
        icon="pi pi-pencil"
        className="p-button-warning p-button-sm"
        tooltip="نوێکردنەوە"
        onClick={() => router.push(`/income/${rowData.id}/update`)}
      />
      <Button
        icon="pi pi-print"
        className="p-button-secondary p-button-sm"
        tooltip="پسوڵە"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        tooltip="سڕینەوە"
        onClick={() => confirmDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div
      className={`${rabar.className} p-4 bg-white shadow-md bg-linear-65 from-blue-500 to-green-500 min-h-screen`}
      dir="rtl"
    >
      <ConfirmDialog />
      <Installment
        visible={isInstallmentVisible}
        onHide={() => setIsInstallmentVisible(false)}
      />

      <OtherIncome
        visible={showOtherIncomeDialog}
        onHide={() => setShowOtherIncomeDialog(false)}
        onSuccess={fetchIncome} // Fetch income after new entry
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 text-right">
          لیستی داهات
        </h2>
        <div className="flex flex-row flex-wrap items-center gap-4">
          <Button
            label="تۆمارکردنی قیست"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => setIsInstallmentVisible(true)} // Show Dialog
          />
          <Button
            label="تۆمارکردنی داهاتی دیکە"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => setShowOtherIncomeDialog(true)}
          />
        </div>
      </div>

      <DataTable
        value={income}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        className="rtl-table"
        tableStyle={{ minWidth: "40rem", textAlign: "right" }}
      >
        <Column
          field="amount"
          header="بڕی داهات"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          field="source"
          header="سەرچاوەی داهات"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          field="students.name"
          header="خوێندکار"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          header="کار"
          body={actionBodyTemplate}
          style={{ width: "10%" }}
        />
      </DataTable>
    </div>
  );
};

export default IncomeTable;
