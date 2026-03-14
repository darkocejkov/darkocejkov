"use client";

import { useState } from "react";
import type { Course } from "@/lib/strapi";

export default function CourseList({ courses }: { courses: Course[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {open ? "Hide courses" : `Show courses (${courses.length})`}
      </button>
      {open && (
        <ul className="mt-2 grid grid-cols-1 gap-1 gap-x-10 sm:grid-cols-2">
          {courses.map((course) => (
            <li key={course.id} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-700">{course.name}</span>
              {course.grade && (
                <span className="shrink-0 text-xs text-gray-400">{course.grade}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}