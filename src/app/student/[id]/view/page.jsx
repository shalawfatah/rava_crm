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

const page = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("name, age, phone, school, gender, address, institute")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching student:", error.message);
      } else {
        setStudent(data);
      }
    };

    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("student_courses")
        .select("courses(name)")
        .eq("student_id", id);

      if (error) {
        console.error("Error fetching courses:", error.message);
      } else {
        setCourses(data.map((item) => item.courses)); // Extract course names
      }
    };

    Promise.all([fetchStudent(), fetchCourses()]).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!student) {
    return (
      <div className={`${rabar.className} flex flex-col justify-center items-center h-screen`} dir="rtl">
        <p className="text-xl font-semibold text-red-600">خوێندکار نەدۆزرایەوە!</p>
        <Button label="گەڕاندنەوە" className="p-button-secondary mt-4" onClick={() => router.back()} />
      </div>
    );
  }

  return (
    <div className={`${rabar.className} bg-linear-65 from-purple-500 to-pink-500 min-h-screen p-6 mx-auto bg-white shadow-md rounded-md`} dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card title="بینینی زانیاری خوێندکار">
          <Fieldset legend="زانیاری خوێندکار">
            <p><strong>ناو:</strong> {student.name}</p>
            <p><strong>تەمەن:</strong> {student.age}</p>
            <p><strong>تەلەفۆن:</strong> {student.phone}</p>
            <p><strong>خوێندنگە:</strong> {student.school}</p>
            <p><strong>رەگەز:</strong> {student.gender}</p>
            <p><strong>ناونیشان:</strong> {student.address}</p>
            <p><strong>پەیمانگا:</strong> {student.institute}</p>
          </Fieldset>
          <Fieldset legend="خولی بەشداربوو" className="mt-4">
            {courses.length > 0 ? (
              <ul>
                {courses.map((course, index) => (
                  <li key={index} className="mt-2">{course.name}</li>
                ))}
              </ul>
            ) : (
              <p>هیچ خوڵێک بەشدار نەبووە</p>
            )}
          </Fieldset>
          <div className="mt-4 flex justify-end">
            <Button label="گەڕانەوە" icon="pi pi-arrow-left" className="p-button-secondary" onClick={() => router.back()} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
