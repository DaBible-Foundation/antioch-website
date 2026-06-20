"use client";

import { useEffect, useState } from "react";

import BibleStudyForm from "./BibleStudyForm";

export default function ClientBibleStudyForm() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow-2xl px-4 py-8 sm:p-10 max-w-xl sm:max-w-2xl w-full mx-auto min-h-[640px]" />
    );
  }

  return <BibleStudyForm />;
}
