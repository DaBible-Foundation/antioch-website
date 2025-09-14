import type { Metadata } from 'next'
import VolunteerFormIframe from "./VolunteerIframe";

export const metadata: Metadata = {
  title: "Volunteer Form - Antioch Campus Experience | DaBible Foundation",
  description: "Fill this form to volunteer during the next Antioch Campus Experience. Join us in winning souls and setting others on fire on campus.",
  openGraph: {
    title: "Volunteer Form - Antioch Campus Experience | DaBible Foundation",
    description: "Fill this form to volunteer during the next Antioch Campus Experience. Join us in winning souls and setting others on fire on campus.",
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
    title: "Volunteer Form - Antioch Campus Experience | DaBible Foundation",
    description: "Fill this form to volunteer during the next Antioch Campus Experience. Join us in winning souls and setting others on fire on campus.",
    images: ["https://welcometoantioch.com/png/ACE-coming-soon.png"],
  },
};

export default function CampusExperiencePage() {
  return <VolunteerFormIframe />;
}