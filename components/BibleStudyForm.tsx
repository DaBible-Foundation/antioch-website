/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

type CountryOption = {
  name: string;
  dialCode: string;
  flag: string;
  countryCode: string;
};

const NANP_COUNTRIES = new Set([
  'US','CA','AG','AI','AS','BB','BM','BS','DM','DO','GD','GU','JM','KN','KY','LC','MP','MS','PR','SX','TC','TT','VC','VG','VI'
]);

// Explicit overrides if restcountries ever returns something odd
const DIAL_CODE_OVERRIDES: Record<string,string> = {
  US: '+1',
  CA: '+1',
  GB: '+44',
  AU: '+61',
  NZ: '+64'
};

function resolveDialCode(countryCode: string, root?: string, suffixes?: string[]): string {
  if (!root) return '';
  if (DIAL_CODE_OVERRIDES[countryCode]) return DIAL_CODE_OVERRIDES[countryCode];
  if (NANP_COUNTRIES.has(countryCode)) return root; // All NANP share +1
  if (suffixes && suffixes.length === 1) {
    return `${root}${suffixes[0]}`;
  }
  // For most others, if multiple suffixes exist, the root alone is not a dial code.
  // We choose the first suffix that produces a known-style code (heuristic).
  if (suffixes && suffixes.length > 1) {
    // Prefer the shortest suffix if lengths vary (often the main assignment)
    const shortest = [...suffixes].sort((a,b) => a.length - b.length)[0];
    return `${root}${shortest}`;
  }
  return root;
}

export default function BibleStudyForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",     // ISO (unique)
    countryName: "",
    dialCode: "",        // NEW: store dial code separately
    phone: "",
    contactPreference: "",
    otherContactDetail: ""
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2')
      .then(res => res.json())
      .then((data) => {
        const formatted: CountryOption[] = data
          .map((c: any) => {
            const name = c?.name?.common;
            const root = c?.idd?.root;               // e.g. "+1" or "+2"
            const suffixes: string[] | undefined = c?.idd?.suffixes;
            const countryCode: string = c?.cca2;
            if (!name || !countryCode || !root) return null;

            const dialCode = resolveDialCode(countryCode, root, suffixes);
            if (!dialCode) return null;

            const flag = countryCode
              .toUpperCase()
              .replace(/./g, (ch: string) => String.fromCodePoint(127397 + ch.charCodeAt(0)));

            return { name, dialCode, flag, countryCode };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setCountries(formatted);
      })
      .catch(err => console.error("Failed to fetch countries", err));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    if (!recaptchaToken) {
      alert("Please verify you are not a robot.");
      setStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/bible-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1).toLowerCase(),
          lastName: formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1).toLowerCase(),
          email: formData.email,
          country: formData.countryName,
          countryCode: formData.countryCode,
          dialCode: formData.dialCode,
          phone: formData.phone,
          contactPreference: formData.contactPreference,
          otherContactDetail: formData.otherContactDetail, 
          recaptchaToken,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          countryName: "",
          dialCode: "",
          phone: "",
          contactPreference: "",
          otherContactDetail: ""
        });
        setRecaptchaToken(null);
        router.push("/congratulations");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  };

  const selectedCountry = countries.find(c => c.countryCode === formData.countryCode);
  const phoneCountry = (selectedCountry?.countryCode || 'US') as import('react-phone-number-input').Country;

  return (
    <div className="bg-white rounded-lg shadow-2xl px-4 py-8 sm:p-10 max-w-xl sm:max-w-2xl w-full mx-auto">
      <h3 className="text-3xl md:text-5xl text-gray-900 mb-4 font-montserrat font-extrabold">
        Register
      </h3>
      <p className="text-md md:text-lg text-gray-700 mb-6">
        We look forward to meeting you, register to join our Daily Bible Study
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className='flex flex-col sm:flex-row gap-4 w-full'>
          <div className='w-full'>
            <label htmlFor="firstName" className="block sr-only">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
              required
            />
          </div>
          <div className='w-full'>
            <label htmlFor="lastName" className="block sr-only">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block sr-only">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block sr-only">Country</label>
          <Select
            id="country"
            inputId="bible-study-country-input"          // added
            instanceId="bible-study-country"             // added
            name="country"
            className="text-black text-sm sm:text-base"
            classNamePrefix="react-select"
            options={countries.map(c => ({
              value: c.countryCode,
              label: `${c.flag} ${c.name} (${c.dialCode})`,
              dialCode: c.dialCode,
              plainName: c.name,
              countryCode: c.countryCode
            }))}
            value={
              countries
                .map(c => ({
                  value: c.countryCode,
                  label: `${c.flag} ${c.name} (${c.dialCode})`,
                  dialCode: c.dialCode,
                  plainName: c.name,
                  countryCode: c.countryCode
                }))
                .find(opt => opt.value === formData.countryCode) || null
            }
            onChange={(option: any) => {
              setFormData(prev => ({
                ...prev,
                countryCode: option?.countryCode || '',
                countryName: option?.plainName || '',
                dialCode: option?.dialCode || '',
              }));
            }}
            placeholder="Select your country"
            isSearchable
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block sr-only">Phone</label>
          <PhoneInput
            international
            country={phoneCountry} 
            required
            placeholder={
              selectedCountry
                ? `Phone Number (${selectedCountry.dialCode})`
                : "Phone Number"
            }
            value={formData.phone}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
          />
        </div>

        <div>
          <label htmlFor="contactPreference" className="block text-sm font-medium sr-only text-gray-700 mb-1">
            Preferred Contact Method
          </label>
          <select
            id="contactPreference"
            name="contactPreference"
            value={formData.contactPreference}
            onChange={(e) => {
              const val = e.target.value;
              setFormData(prev => ({
                ...prev,
                contactPreference: val,
                // reset extra field if changing away from Other
                otherContactDetail: val === "Other" ? prev.otherContactDetail : ""
              }));
            }}
            required
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
          >
            <option value="" disabled>Preferred Contact Method</option>
            <option value="SMS">SMS</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Telegram">Telegram</option>
            <option value="Instagram">Instagram</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.contactPreference === "Other" && (
          <div>
            <label htmlFor="otherContactDetail" className="block text-sm font-medium text-gray-700 mb-1">
              Specify Other Contact Method
            </label>
            <input
              type="text"
              id="otherContactDetail"
              name="otherContactDetail"
              placeholder="e.g. Signal, WeChat, etc."
              value={formData.otherContactDetail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
              required
            />
          </div>
        )}

        <div>
          <ReCAPTCHA
            sitekey="6LdFrEwrAAAAANVypGG4w4jpPR6SC-oEEq8hNraj"
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className={`w-full ${
              status === "submitting" ? "bg-gray-400 cursor-not-allowed" : "bg-[#C8385E] hover:bg-[#C8385E]/90"
            } text-white font-medium text-sm sm:text-base py-3 px-4 rounded-full transition-colors duration-300`}
          >
            {status === "submitting" ? "Sending..." : "Submit"}
          </button>
        </div>

        {status === "success" && (
          <p className="text-center text-green-600 text-sm">Message sent successfully!</p>
        )}
        {status === "error" && (
          <p className="text-center text-red-500 text-sm">Something went wrong. Please try again.</p>
        )}

        <p className="text-center text-xs sm:text-sm text-gray-500">
          By submitting this form you agree to DaBible Foundation's{" "}
          <Link href="/privacy-policy" className="text-[#C8385E] hover:underline">
            Privacy Policy
          </Link>{" "}
          and acknowledge that you have read the policy.
        </p>
      </form>
    </div>
  );
}