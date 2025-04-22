"use client";
import { supabase } from "@/app/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

const find_course_id = async (name, course_type, cohort, teacher) => {
  const { data, error } = await supabase.rpc("find_course_id", {
    p_name: name,
    p_course_type: course_type,
    p_cohort: cohort,
    p_teacher: teacher,
  });

  if (error) {
    console.error("Error finding course ID:", error.message);
    return null;
  }

  return data;
};

function CoursePick({ onCourseChange }) {
  const [names, setNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [filteredTypes, setFilteredTypes] = useState({});
  const [filteredCohorts, setFilteredCohorts] = useState({});
  const [selectedCourses, setSelectedCourses] = useState({});

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

  const fetchTeachers = async (courseNameId) => {
    const { data } = await supabase
      .from("teachers")
      .select("id, name")
      .eq("expertise", courseNameId);

    setTeachers((prev) => ({
      ...prev,
      [courseNameId]: data || [],
    }));
  };

  const fetchCourseDetails = async (courseNameId, teacherId) => {
    const { data: courses } = await supabase
      .from("courses")
      .select("course_type, cohort")
      .eq("name", courseNameId)
      .eq("teacher", teacherId);

    if (courses) {
      const uniqueTypes = Array.from(
        new Set(courses.map((c) => c.course_type)),
      ).map((id) => types.find((t) => t.id === id));

      const uniqueCohorts = Array.from(
        new Set(courses.map((c) => c.cohort)),
      ).map((id) => cohorts.find((c) => c.id === id));

      setFilteredTypes((prev) => ({ ...prev, [courseNameId]: uniqueTypes }));
      setFilteredCohorts((prev) => ({
        ...prev,
        [courseNameId]: uniqueCohorts,
      }));
    }
  };

  const handleCheckboxChange = (id) => {
    const newSelected = { ...selectedCourses };
    if (newSelected[id]) {
      delete newSelected[id];
    } else {
      newSelected[id] = { teacher: null, type: null, cohort: null };
    }

    setSelectedCourses(newSelected);

    if (onCourseChange) {
      onCourseChange(newSelected); // ✅ now safe
    }

    if (!teachers[id]) fetchTeachers(id);
  };

  const handleDropdownChange = async (id, key, value) => {
    const updatedCourse = { ...selectedCourses[id], [key]: value };

    if (key === "teacher") {
      fetchCourseDetails(id, value);
    }

    const newSelectedCourses = {
      ...selectedCourses,
      [id]: updatedCourse,
    };

    setSelectedCourses(newSelectedCourses);

    if (updatedCourse.teacher && updatedCourse.type && updatedCourse.cohort) {
      const courseId = await find_course_id(
        id,
        updatedCourse.type,
        updatedCourse.cohort,
        updatedCourse.teacher,
      );

      if (courseId) {
        const finalCourse = { ...updatedCourse, course_id: courseId };
        const finalSelectedCourses = {
          ...selectedCourses,
          [id]: finalCourse,
        };

        setSelectedCourses(finalSelectedCourses);

        if (onCourseChange) {
          onCourseChange(finalSelectedCourses);
        }
      }
    } else {
      if (onCourseChange) {
        onCourseChange(newSelectedCourses);
      }
    }
  };

  return (
    <div className="p-4">
      {names.map((course) => (
        <div key={course.id} className="mb-4">
          <div>
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
                  placeholder="مامۆستایەک هەڵبژێرە"
                  className="w-full"
                />
                <Dropdown
                  value={selectedCourses[course.id].type}
                  options={
                    filteredTypes[course.id]?.map((t) => ({
                      label: t.name,
                      value: t.id,
                    })) || []
                  }
                  onChange={(e) =>
                    handleDropdownChange(course.id, "type", e.value)
                  }
                  placeholder="جۆری خول"
                  className="w-full"
                  disabled={!selectedCourses[course.id].teacher}
                />
                <Dropdown
                  value={selectedCourses[course.id].cohort}
                  options={
                    filteredCohorts[course.id]?.map((c) => ({
                      label: c.name,
                      value: c.id,
                    })) || []
                  }
                  onChange={(e) =>
                    handleDropdownChange(course.id, "cohort", e.value)
                  }
                  placeholder="گروپی خول"
                  className="w-full"
                  disabled={!selectedCourses[course.id].teacher}
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
