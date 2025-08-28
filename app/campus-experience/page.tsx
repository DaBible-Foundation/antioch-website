import type { Metadata } from 'next'
import CampusExperienceIframe from "./CampusExperienceIframe";

export const metadata: Metadata = {
  title: "Campus Experience | DaBible Foundation",
  description: "Experience our campus events, workshops, and Bible study sessions. Connect with other students and grow in faith.",
  openGraph: {
    title: "Campus Experience | DaBible Foundation",
    description: "Join us on the next Campus Experience in your campus for a night of fire, prayers and empowerment in the Holy Ghost. Connect with other students and grow in faith.",
    images: [
      {
        url: "https://welcometoantioch.com/png/ACE-coming-soon.png",
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
    images: ["https://welcometoantioch.com/png/ACE-coming-soon.png"],
  },
};

export default function CampusExperiencePage() {
  return <CampusExperienceIframe />;
}