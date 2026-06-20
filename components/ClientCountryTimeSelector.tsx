"use client";

import { useEffect, useState } from "react";

import CountryTimeSelector from "./CountryTimeSelector";

export default function ClientCountryTimeSelector() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="my-6 p-4 bg-white rounded-lg shadow-md max-w-md min-h-[180px] mx-auto" />
    );
  }

  return <CountryTimeSelector />;
}
