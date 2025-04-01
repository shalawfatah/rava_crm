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

const ViewCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("course_name(*), price, teacher_share, discount, teacher(name), course_type(name)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching course:", error.message);
      } else {
        setCourse(data);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`${rabar.className} flex flex-col justify-center items-center h-screen`} dir="rtl">
        <p className="text-xl font-semibold text-red-600">خول نەدۆزرایەوە!</p>
        <Button label="گەڕاندنەوە" className="p-button-secondary mt-4" onClick={() => router.back()} />
      </div>
    );
  }

  return (
    <div className={`${rabar.className} bg-white min-h-screen p-6 mx-auto shadow-md rounded-md`} dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card title="بینینی زانیاری خول">
          <Fieldset legend="زانیاری خول">
            <p><strong>ناو:</strong> {course.course_name?.name}</p>
            <p><strong>نرخ:</strong> {course.price}</p>
            <p><strong>پشکی مامۆستا:</strong> {course.teacher_share}%</p>
            <p><strong>داشکاندن:</strong> {course.discount}%</p>
            <p><strong>مامۆستای خول:</strong> {course.teacher.name}</p>
            <p><strong>جۆری خول:</strong> {course.course_type.name}</p>
          </Fieldset>
          <div className="mt-4 flex justify-end">
            <Button label="گەڕاندنەوە" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => router.back()} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewCourse;
