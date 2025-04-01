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

const ViewTeacher = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchTeacher = async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("name, course_name(*)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching teacher:", error.message);
      } else {
        setTeacher(data);
      }
      setLoading(false);
    };

    fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className={`${rabar.className} flex flex-col justify-center items-center h-screen`} dir="rtl">
        <p className="text-xl font-semibold text-red-600">مامۆستا نەدۆزرایەوە!</p>
        <Button label="گەڕاندنەوە" className="p-button-secondary mt-4" onClick={() => router.back()} />
      </div>
    );
  }
  return (
    <div className={`${rabar.className} bg-white min-h-screen p-6 mx-auto shadow-md rounded-md`} dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card title="بینینی زانیاری مامۆستا">
          <Fieldset legend="زانیاری مامۆستا">
            <p><strong>ناو:</strong> {teacher.name}</p>
            <p><strong>تایبەتمەندی:</strong> {teacher.course_name?.name}</p>
          </Fieldset>
          <div className="mt-4 flex justify-end">
            <Button label="گەڕاندنەوە" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => router.back()} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewTeacher;
