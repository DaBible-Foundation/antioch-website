"use client";
import { useState } from "react";
import "animate.css";

export default function CampusExperienceIframe() {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="min-h-screen bg-gray-300"
      style={{
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
        marginTop: 80,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <section className="relative max-w-[900px] h-full mx-auto overflow-hidden">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: '90%',
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
              overflow: "auto",
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