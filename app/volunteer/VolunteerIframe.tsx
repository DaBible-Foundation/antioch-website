"use client";
import { useState } from "react";
import Image from "next/image";
import "animate.css";

export default function VolunteerFormIframe() {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="min-h-screen bg-gray-300"
      style={{
        overflow: "auto",
        height: "100vh",
        width: "100vw",
        marginTop: 80,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <section className="relative max-w-[900px] h-9/12 mx-auto overflow-hidden">
        <Image src="/png/volunteer-header2.png" alt="Sign Up to Volunteer" className="mx-auto w-full" width={900} height={100}/>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: '80%',
            paddingTop: "100%",
            paddingBottom: 0,
            boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
            // marginTop: "1.6em",
            marginBottom: "0",
            overflow: "hidden",
            borderRadius: "0",
            willChange: "transform",
          }}
        >
          {loading && (
            <div className="flex items-center justify-center h-full w-full absolute !top-0 left-0 bg-gray-300 z-10">
              <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#6B051F]"></span>
              <span className="ml-4 text-lg font-semibold text-[#6B051F]">Loading...</span>
            </div>
          )}
          <iframe
            loading="lazy"
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              border: "none",
              padding: 0,
              margin: 0,
              marginTop: 0,
              overflow: "auto",
            }}
            src="https://tally.so/embed/wd7vGV?alignLeft=1&hideTitle=1&transparentBackground=0&dynamicHeight=1"
            allowFullScreen
            allow="fullscreen"
            onLoad={() => setLoading(false)}
            title="Volunteer Form"
          ></iframe>
        </div>
        <Image src="/svg/volunteer-middle.svg" alt="Sign Up to Volunteer" className="mx-auto w-full" width={900} height={100}/>
      </section>
    </div>
  );
}