"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";

const rabar = localFont({ src: "./dashboard/rabar.ttf" });

const InstallmentDialog = ({ visible, onHide }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.rpc("get_enrolled_students");
      if (error) console.error("Error fetching students:", error);
      else setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleStudentChange = async (student) => {
    setSelectedStudent(student);
    setFinancials(null);

    if (!student) return;

    // Fetch student financial data
    const { data, error } = await supabase.rpc("get_student_financials", {
      student_uuid: student.id,
    });

    if (error) {
      console.error("Error fetching financials:", error);
      return;
    }

    setFinancials(data);
  };

  const formatCurrency = (amount) => {
    const formattedAmount = (amount || 0).toLocaleString("ar-IQ");
    return (
      <div className="flex flex-col items-center">
        <div className="text-lg">
          {formattedAmount} <span className="text-sm">د.ع</span>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!selectedStudent || !installmentAmount) return;

    const { error } = await supabase.from("installments").insert([
      {
        inst_amount: installmentAmount,
        student_id: selectedStudent.id,
      },
    ]);

    if (error) {
      console.error("Error adding installment:", error);
    } else {
      handleStudentChange(selectedStudent); // Refresh financials
      setInstallmentAmount(null);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="زیادکردنی قیست"
      modal
      className={`${rabar.className} w-96`}
      dir="rtl"
    >
      <div className="flex flex-col gap-4">
        {/* Student Dropdown */}
        <label className="font-semibold">خوێندکار</label>

        <Dropdown
          value={selectedStudent}
          options={students}
          onChange={(e) => handleStudentChange(e.value)}
          optionLabel="name"
          placeholder="خوێندکارێک هەڵبژێرە"
          className="w-full"
          filter
          filterBy="name" // Ensure filtering is done on the "name" field
        />

        {/* Financial Info Display */}
        {financials && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <div className="font-semibold text-blue-600">
              بڕی قەرز: {formatCurrency(financials.total_debt)}
            </div>
            <div className="font-semibold text-green-600">
              کۆی دراو: {formatCurrency(financials.total_income)}
            </div>
            <div className="font-semibold text-red-600">
              قەرزی ماوە: {formatCurrency(financials.remaining_debt)}
            </div>
            <div className="mt-2">
              <div className="font-semibold">قیستەکانی پێشتر:</div>
              {financials.installment_array.length > 0 ? (
                financials.installment_array.map((inst, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    قیستی {index + 1}: {formatCurrency(inst)}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">هیچ قیست نیە</div>
              )}
            </div>
          </div>
        )}

        {/* Installment Amount Input */}
        <label className="font-semibold">بڕی قیست</label>
        <InputNumber
          value={installmentAmount}
          onValueChange={(e) => setInstallmentAmount(e.value)}
          mode="decimal"
          min={1}
          className="w-full"
        />

        {/* Submit Button */}
        <Button
          label="تۆمارکردن"
          icon="pi pi-check"
          className="p-button-success w-full"
          onClick={handleSubmit}
        />
      </div>
    </Dialog>
  );
};

export default InstallmentDialog;
