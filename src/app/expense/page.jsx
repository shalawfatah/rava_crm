"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import TeacherExpense from "@/app/components/TeacherExpense";
import OtherExpenseDialog from "@/app/components/OtherExpense";

const rabar = localFont({ src: "../components/dashboard/rabar.ttf" });

const ExpensesTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [teacherDialogVisible, setTeacherDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("id, amount, description, teacher_id, teachers(name)")
      .order("id", { ascending: false });

    if (!error) {
      setExpenses(data);
    } else {
      console.error("Error fetching expenses:", error.message);
    }
  };

  const confirmDelete = (id) => {
    setSelectedExpenseId(id);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedExpenseId) return;
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", selectedExpenseId);
    if (error) {
      console.error("Error deleting expense:", error.message);
    } else {
      setExpenses((prev) =>
        prev.filter((item) => item.id !== selectedExpenseId),
      );
    }
    setDeleteDialogVisible(false);
    setSelectedExpenseId(null);
  };

  const handleAddExpense = async (amount, description) => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([{ amount, description }]);

    if (!error) {
      fetchExpenses(); // Refresh list after adding
      setDialogVisible(false);
    } else {
      console.error("Error adding expense:", error.message);
    }
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-start">
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        tooltip="سڕینەوەی خەرجی"
        onClick={() => confirmDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div
      className={`${rabar.className} p-4 bg-white shadow-md bg-gradient-to-r from-blue-500 to-green-500 min-h-screen`}
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 text-right">
          لیستی خەرجییەکان
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            label="تۆمارکردنی خەرجی مامۆستا"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => setTeacherDialogVisible(true)}
          />
          <Button
            label="تۆمارکردنی خەرجی دیکە"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => setDialogVisible(true)}
          />
        </div>
      </div>

      <DataTable
        value={expenses}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
        className="rtl-table"
        tableStyle={{ minWidth: "40rem", textAlign: "right" }}
      >
        <Column
          field="amount"
          body={(rowData) => `${rowData.amount.toLocaleString()} د.ع`}
          header="بڕی خەرجی"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          field="description"
          header="وردەکاری"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          field="teachers.name"
          header="مامۆستا"
          style={{ width: "30%", textAlign: "right" }}
        />
        <Column
          header="کار"
          body={actionBodyTemplate}
          style={{ width: "10%" }}
        />
      </DataTable>

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        header="دڵنیای لە سڕینەوەی خەرجی؟"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="نەخێر"
              className="p-button-info"
              onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
              label="بەڵێ"
              className="p-button-danger"
              onClick={handleDelete}
            />
          </div>
        }
      >
        <p className="text-right">دەتەوێت ئەم خەرجییە بسڕیتەوە؟</p>
      </Dialog>

      {/* TeacherExpense Modal */}
      <TeacherExpense
        visible={teacherDialogVisible}
        onHide={() => setTeacherDialogVisible(false)}
        onSubmit={handleAddExpense}
      />

      {/* OtherExpenseDialog */}
      <OtherExpenseDialog
        visible={isDialogVisible}
        onHide={() => setDialogVisible(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
};

export default ExpensesTable;
