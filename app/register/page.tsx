import BibleStudyForm from "@/components/BibleStudyForm";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register for Antioch Online Bible Study | DaBible Foundation",
  description: "Register to join Antioch Online Bible Study and grow with other believers in the Word of God.",
  openGraph: {
    title: "Register for Antioch Online Bible Study | DaBible Foundation",
    description: "Register to join Antioch Online Bible Study and grow with other believers in the Word of God.",
    images: [
      {
        url: "https://welcometoantioch.com/png/antioch-large.png",
        width: 1200,
        height: 630,
        alt: "Antioch Online Bible Study registration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Register for Antioch Online Bible Study | DaBible Foundation",
    description: "Register to join Antioch Online Bible Study and grow with other believers in the Word of God.",
    images: ["https://welcometoantioch.com/png/antioch-large.png"],
  },
};

export default function RegisterPage() {
  return (
    <main className="bg-white py-16 px-6 md:px-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-8xl lg:text-6xl xl:text-8xl font-extrabold text-[#1e1e1e] leading-tight font-montserrat">
          Join <span className="text-white bg-red-500 px-8 py-1 rounded-2xl italic">Us</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 content-stretch items-center">
        <BibleStudyForm />

        <div className="w-full mx-auto items-stretch lg:h-full text-center justify-center">
          <h3 className="text-2xl md:text-4xl text-gray-900 mb-4 font-montserrat font-extrabold">
            Current Session:
          </h3>
          <p className="text-md md:text-lg text-gray-700 mb-6">
            We are studying the book of Hebrews, and its interesting!
          </p>
          <Image
            width={500}
            height={500}
            src="/designs/hebrews.jpg"
            alt="Book of Hebrews Poster"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </main>
  );
}
