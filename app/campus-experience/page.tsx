"use client";
import { useState } from "react";
import type { Metadata } from 'next'
import "animate.css";

export const metadata: Metadata = {
  title: "Campus Experience | DaBible Foundation",
  description: "Experience our campus events, workshops, and Bible study sessions. Connect with other students and grow in faith.",
  openGraph: {
    title: "Campus Experience | DaBible Foundation",
    description: "Join us on the next Campus Experience in your campus for a night of fire, prayers and empowerment in the Holy Ghost. Connect with other students and grow in faith.",
    images: [
      {
        url: "https://dabible.com/png/ACE-coming-soon.png",
        width: 1200,
        height: 630,
        alt: "Campus Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Experience | DaBible Foundation",
    description: "Join us on the next Campus Experience in your campus for a night of fire, prayers and empowerment in the Holy Ghost. Connect with other students and grow in faith.",
    images: ["https://dabible.com/png/ACE-coming-soon.png"],
  },
};

export default function CampusExperiencePage() {
    const [loading, setLoading] = useState(true);
  return (
    <div
      className="min-h-screen bg-gray-300"
      style={{
        overflow: "hidden", // Prevent page scroll
        height: "100vh",
        width: "100vw",
        marginTop: 80,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <section className="relative max-w-[900px] mx-auto overflow-hidden">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingTop: "100%",
            paddingBottom: 0,
            boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
            marginTop: "1.6em",
            marginBottom: "0.9em",
            overflow: "hidden",
            borderRadius: "8px",
            willChange: "transform",
          }}
        >
          {loading && (
            <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 bg-gray-300 z-10">
              <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#6B051F]"></span>
              <span className="ml-4 text-lg font-semibold text-[#6B051F]">Loading...</span>
            </div>
          )}
          <iframe
            loading="lazy"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              border: "none",
              padding: 0,
              margin: 0,
              overflow: "auto", // Enable iframe scroll
            }}
            src="https://www.canva.com/design/DAGxXqKRawg/IhH6ZcwUxHYap98pLhFFmA/view?embed"
            allowFullScreen
            allow="fullscreen"
            onLoad={() => setLoading(false)}
            title="Campus Experience"
          ></iframe>
        </div>
      </section>
    </div>
  );
}



