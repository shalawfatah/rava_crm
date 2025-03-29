"use client";
import { supabase } from "@/app/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

function CoursePick() {
  const [names, setNames] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [selectedCourses, setSelectedCourses] = useState({});
  const [types, setTypes] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: courseNames } = await supabase.from("course_name").select();
      const { data: courseTypes } = await supabase.from("course_type").select();
      const { data: cohortData } = await supabase.from("cohort").select();

      setNames(courseNames || []);
      setTypes(courseTypes || []);
      setCohorts(cohortData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      const selectedIds = Object.keys(selectedCourses).filter(
        (id) => selectedCourses[id],
      );
      if (selectedIds.length === 0) return;

      const { data } = await supabase
        .from("teachers")
        .select()
        .in("expertise", selectedIds);
      if (data) {
        const teacherMap = {};
        selectedIds.forEach((id) => {
          teacherMap[id] = data.filter((t) => t.expertise === id);
        });
        setTeachers((prev) => ({ ...prev, ...teacherMap }));
      }
    };

    fetchTeachers();
  }, [selectedCourses]);

  const handleCheckboxChange = (id) => {
    setSelectedCourses((prev) => ({
      ...prev,
      [id]: prev[id] ? undefined : { teacher: null, type: null, cohort: null },
    }));
  };

  const handleDropdownChange = (id, key, value) => {
    setSelectedCourses((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  return (
    <div className="p-4">
      {names.map((course) => (
        <div key={course.id} className="mb-4">
          <div className="">
            <Checkbox
              inputId={course.id}
              checked={!!selectedCourses[course.id]}
              onChange={() => handleCheckboxChange(course.id)}
            />
            <label htmlFor={course.id} className="text-gray-700">
              {course.name}
            </label>
            {selectedCourses[course.id] && (
              <div className="mt-2 flex flex-col gap-2">
                <Dropdown
                  value={selectedCourses[course.id].teacher}
                  options={
                    teachers[course.id]?.map((t) => ({
                      label: t.name,
                      value: t.id,
                    })) || []
                  }
                  onChange={(e) =>
                    handleDropdownChange(course.id, "teacher", e.value)
                  }
                  placeholder="مامۆستا هەڵبژێرە"
                  className="w-full"
                />
                <Dropdown
                  value={selectedCourses[course.id].type}
                  options={types.map((t) => ({ label: t.name, value: t.id }))}
                  onChange={(e) =>
                    handleDropdownChange(course.id, "type", e.value)
                  }
                  placeholder="جۆری خول"
                  className="w-full"
                />
                <Dropdown
                  value={selectedCourses[course.id].cohort}
                  options={cohorts.map((c) => ({ label: c.name, value: c.id }))}
                  onChange={(e) =>
                    handleDropdownChange(course.id, "cohort", e.value)
                  }
                  placeholder="گروپی خول"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoursePick;
