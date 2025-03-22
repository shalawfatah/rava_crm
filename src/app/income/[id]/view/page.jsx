"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";
import localFont from "next/font/local";
import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

const rabar = localFont({ src: "../../../components/dashboard/rabar.ttf" });

const IncomeView = () => {
  const params = useParams();
  const incomeId = params?.id;
  const [income, setIncome] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!incomeId) return;

    const fetchIncomeDetails = async () => {
      const { data: incomeData, error: incomeError } = await supabase
        .from("income")
        .select("id, amount, source, note, student_id, students(name)")
        .eq("id", incomeId)
        .single();

      if (incomeError) {
        console.error("Error fetching income:", incomeError.message);
      } else {
        setIncome(incomeData);
      }
    };

    const fetchInstallments = async () => {
      const { data: installmentsData, error: installmentsError } = await supabase
        .from("installments")
        .select("inst_amount, income")
        .eq("income", incomeId)
        .order("id", { ascending: true });

      if (installmentsError) {
        console.error("Error fetching installments:", installmentsError.message);
      } else {
        setInstallments(installmentsData);
      }
    };

    Promise.all([fetchIncomeDetails(), fetchInstallments()]).finally(() => setLoading(false));
  }, [incomeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!income) {
    return (
      <div className={`${rabar.className} flex flex-col justify-center items-center h-screen`} dir="rtl">
        <p className="text-xl font-semibold text-red-600">داهاتەکە نەدۆزرایەوە!</p>
        <Button label="گەڕاندنەوە" className="p-button-secondary mt-4" onClick={() => router.back()} />
      </div>
    );
  }

  return (
    <div className={`${rabar.className} bg-white min-h-screen p-6 mx-auto shadow-md rounded-md`} dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card title="بینینی داهات">
          <Fieldset legend="زانیاری داهات">
            <p><strong>بڕ:</strong> {income.amount}</p>
            <p><strong>سەرچاوە:</strong> {income.source}</p>
            <p><strong>تێبینی:</strong> {income.note || "نەبوو"}</p>
            <p><strong>خوێندکار:</strong> {income.students?.name || "نەبوو"}</p>
          </Fieldset>

          {installments.length > 0 && (
            <Fieldset legend="قیستەکان" className="mt-4">
              {installments.map((inst, index) => (
                <p key={index}><strong>قیستی {index + 1}:</strong> {inst.inst_amount}</p>
              ))}
            </Fieldset>
          )}

          <div className="mt-4 flex justify-end">
            <Button label="گەڕانەوە" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => router.back()} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IncomeView;
