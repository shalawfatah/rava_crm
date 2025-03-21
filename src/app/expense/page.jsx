"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

const rabar = localFont({ src: "../components/dashboard/rabar.ttf" });

const ExpensesTable = () => {
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();

  useEffect(() => {
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

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("expense").delete().eq("id", id);
    if (error) {
      console.error("Error deleting expense:", error.message);
    } else {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      console.log("Expense deleted:", id);
    }
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2 justify-start">
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        tooltip="سڕینەوەی خەرجی"
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div
      className={`${rabar.className} p-4 bg-white shadow-md bg-linear-65 from-blue-500 to-green-500 min-h-screen`}
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 text-right">
          لیستی خەرجییەکان
        </h2>
        <Button
          label="تۆمارکردنی خەرجی"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={() => router.push("/expense/add-expense")}
        />
      </div>

      <DataTable
        value={expenses}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        className="rtl-table"
        tableStyle={{ minWidth: "40rem", textAlign: "right" }}
      >
        <Column
          field="amount"
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
    </div>
  );
};

export default ExpensesTable;
