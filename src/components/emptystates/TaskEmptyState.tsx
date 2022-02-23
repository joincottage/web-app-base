//import { useState, useEffect } from "react";
import Link from 'next/link';
import Typography from '@mui/material/Typography';

export default function TaskEmptyState() {
  //TODO: allow for h3 & p to be passed in to make this component reuseable

  return (
    <div className="border-2 rounded-lg border-dotted border-gray-300">
      <div className="text-center py-2 px-2">
        <Link href="#">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 hover:text-blue-500 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </Link>
        <Typography
          variant="subtitle2"
          className="mt-2 text-sm font-bold text-gray-900"
        >
          No Current Tasks
        </Typography>
        <Typography variant="caption" className="mt-1 text-xs text-gray-500">
          Get started on a new task.
        </Typography>
      </div>
    </div>
  );
}
