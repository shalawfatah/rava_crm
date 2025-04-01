"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { supabase } from "@/app/utils/supabase/client";

const InstallmentDialog = ({ visible, onHide }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [incomeAmount, setIncomeAmount] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [remainingBalance, setRemainingBalance] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const {data, error} = await supabase.rpc("get_enrolled_students");
      if (error) console.error("Error fetching students:", error);
      else setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleStudentChange = async (student) => {
    setSelectedStudent(student);
    if (student) {
      // Fetch income
      const { data: income, error: incomeError } = await supabase
        .from("income")
        .select("id, amount")
        .eq("student_id", student.id)
        .single();

      if (incomeError) {
        console.error("Error fetching income:", incomeError);
        setIncomeAmount(null);
      } else {
        setIncomeAmount(income);
      }

      // Fetch installments
      const { data: installmentData, error: installmentError } = await supabase
        .from("installments")
        .select("inst_amount")
        .eq("income", income?.id);

      if (installmentError) {
        console.error("Error fetching installments:", installmentError);
        setInstallments([]);
      } else {
        setInstallments(installmentData);
      }
    } else {
      setIncomeAmount(null);
      setInstallments([]);
    }
  };

  useEffect(() => {
    if (incomeAmount) {
      const totalInstallments = installments.reduce(
        (sum, inst) => sum + inst.inst_amount,
        0,
      );
      setRemainingBalance(incomeAmount.amount - totalInstallments);
    }
  }, [installments, incomeAmount]);

  const handleSubmit = async () => {
    if (!selectedStudent || !installmentAmount || !incomeAmount) return;

    const { error } = await supabase.from("installments").insert([
      {
        inst_amount: installmentAmount,
        income: incomeAmount.id,
      },
    ]);

    if (error) {
      console.error("Error adding installment:", error);
    } else {
      handleStudentChange(selectedStudent); // Refresh installments
      setInstallmentAmount(null);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="زیادکردنی قیست"
      modal
      className="w-96"
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
        />

        {/* Income Amount Display */}
        {incomeAmount && (
          <div className="text-lg font-semibold text-blue-600">
            بڕی داهات: {incomeAmount.amount} دینار
          </div>
        )}

        {/* List of Installments */}
        {installments.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold">قیستەکان:</div>
            {installments.map((inst, index) => (
              <div key={index} className="text-sm text-gray-700">
                قیستی {index + 1}: {inst.inst_amount} دینار
              </div>
            ))}
          </div>
        )}

        {/* Remaining Balance */}
        {remainingBalance !== null && (
          <div className="text-lg font-semibold text-red-600">
            پارەی ماوە: {remainingBalance} دینار
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
