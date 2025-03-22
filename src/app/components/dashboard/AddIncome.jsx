"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const rabar = localFont({ src: "../../../components/dashboard/rabar.ttf" });

const AddIncome = () => {
  const [amount, setAmount] = useState(null);
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [showInstallments, setShowInstallments] = useState("no");
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select("id, name");
      if (error) {
        console.error("Error fetching students:", error.message);
      } else {
        setStudents(data);
      }
    };
    fetchStudents();
  }, []);

  const addInstallment = () => {
    setInstallments([...installments, { inst_amount: null }]);
  };

  const updateInstallmentAmount = (index, value) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index].inst_amount = value;
    setInstallments(updatedInstallments);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Step 1: Insert the income record
    const { data: incomeData, error: incomeError } = await supabase
      .from("income")
      .insert([{ amount, source, note, student_id: studentId || null }])
      .select()
      .single();

    if (incomeError) {
      console.error("Error adding income:", incomeError.message);
      toast.current.show({ severity: "error", summary: "هەڵە!", detail: "نەتوانرا داهات زیاد بکرێت", life: 3000 });
      setLoading(false);
      return;
    }

    const incomeId = incomeData.id;

    // Step 2: Insert installments if enabled
    if (showInstallments === "yes" && installments.length > 0) {
      const installmentRecords = installments.map(inst => ({
        inst_amount: inst.inst_amount,
        income: incomeId,
      }));

      const { error: installmentError } = await supabase.from("installments").insert(installmentRecords);

      if (installmentError) {
        console.error("Error adding installments:", installmentError.message);
        toast.current.show({ severity: "error", summary: "هەڵە!", detail: "نەتوانرا قیستەکان زیاد بکرێن", life: 3000 });
        setLoading(false);
        return;
      }
    }

    toast.current.show({ severity: "success", summary: "سەرکەوتو!", detail: "داهات زیاد کرا", life: 3000 });
    setLoading(false);
    router.back();
  };

  return (
    <div className={`${rabar.className} bg-white min-h-screen p-6 mx-auto shadow-md rounded-md`} dir="rtl">
      <Toast ref={toast} />
      <div className="max-w-2xl mx-auto">
        <Card title="زیادکردنی داهات">
          <Fieldset legend="زانیاری داهات">
            <div className="mb-4">
              <label className="block font-semibold mb-1">بڕ</label>
              <InputNumber value={amount} onValueChange={(e) => setAmount(e.value)} className="w-full" />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">سەرچاوە</label>
              <InputText value={source} onChange={(e) => setSource(e.target.value)} className="w-full" />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">تێبینی</label>
              <InputText value={note} onChange={(e) => setNote(e.target.value)} className="w-full" />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-1">خوێندکار (هەبێت یان نەبێت)</label>
              <Dropdown
                value={studentId}
                options={students}
                onChange={(e) => setStudentId(e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="خوێندکارێک دیاری بکە"
                className="w-full"
              />
            </div>
          </Fieldset>

          <Fieldset legend="قیستەکان" className="mt-4">
            <div className="flex gap-4 items-center">
              <RadioButton
                inputId="yes"
                name="installments"
                value="yes"
                onChange={(e) => setShowInstallments(e.value)}
                checked={showInstallments === "yes"}
              />
              <label htmlFor="yes">بە قیست</label>

              <RadioButton
                inputId="no"
                name="installments"
                value="no"
                onChange={(e) => setShowInstallments(e.value)}
                checked={showInstallments === "no"}
              />
              <label htmlFor="no">نەبێت</label>
            </div>

            {showInstallments === "yes" && (
              <>
                {installments.map((inst, index) => (
                  <div key={index} className="mt-4 flex gap-2 items-center">
                    <InputNumber
                      value={inst.inst_amount}
                      onValueChange={(e) => updateInstallmentAmount(index, e.value)}
                      className="w-full"
                    />
                  </div>
                ))}
                <Button label="زیادکردنی قیست" className="p-button-sm p-button-outlined mt-3" onClick={addInstallment} />
              </>
            )}
          </Fieldset>

          <div className="mt-4 flex justify-end">
            <Button
              label="زیادکردن"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleSubmit}
              disabled={loading}
            />
            <Button
              label="گەڕاندنەوە"
              icon="pi pi-arrow-left"
              className="p-button-secondary ml-2"
              onClick={() => router.back()}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddIncome;
