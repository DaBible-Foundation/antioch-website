/* eslint-disable react/no-unescaped-entities */
"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';
import ReCAPTCHA from "react-google-recaptcha";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function BibleStudyForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    ageGroup: "",
    email: "",
    country: "",
    countryName: "",
    phone: "",
    message: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const maxChars = 350;

  const [countries, setCountries] = useState<{ name: string; dialCode: string; flag: string; countryCode: string }[]>([]);

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Updated API request to include all required fields explicitly
    fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2')
      .then((res) => res.json())
      .then((data) => {
        const formattedCountries = data
          .map((c: any) => {
            const name = c.name?.common;
            const root = c.idd?.root;
            const suffix = Array.isArray(c.idd?.suffixes) ? c.idd.suffixes[0] : '';
            const dialCode = root && suffix ? `${root}${suffix}` : '';
            const countryCode = c.cca2;
            const flag = countryCode
              ? countryCode
                  .toUpperCase()
                  .replace(/./g, (char: string) => String.fromCodePoint(127397 + char.charCodeAt(0)))
              : "";
            return name && dialCode && flag && countryCode ? { name, dialCode, flag, countryCode } : null;
          })
          .filter(Boolean)
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(formattedCountries);
      })
      .catch((err) => console.error("Failed to fetch countries", err));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "message") setCharCount(value.length);
    setFormData({ ...formData, [name]: value });
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
          gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
          ageGroup: formData.ageGroup.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email: formData.email,
          country: formData.countryName,
          phone: formData.phone,
          message: formData.message,
          recaptchaToken, // Include token
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          gender: "",
          ageGroup: "",
          email: "",
          country: "",
          countryName: "",
          phone: "",
          message: "",
        });
        setCharCount(0);
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

  const selectedCountry = countries.find((c) => c.dialCode === formData.country);

  return (
    <div className="bg-white rounded-lg shadow-2xl px-4 py-8 sm:p-10 max-w-xl sm:max-w-2xl w-full mx-auto">
      <h3 className="text-3xl md:text-5xl text-gray-900 mb-4 font-montserrat font-extrabold">
            Register
        </h3>
        <p className="text-md md:text-lg text-gray-700 mb-6">
          We look forward to meeting you, register to join our Daily Bible Study
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className='flex flex-col sm:flex-row gap-4 w-full'>

        
        <div className='w-full'>
          <label htmlFor="firstName" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Full name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 focus:border-transparent"
            required
          />
        </div>

        {/* Last Name */}
        <div className='w-full'>
          <label htmlFor="lastName" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 focus:border-transparent"
            required
          />
        </div>

        </div>

        <div className='flex flex-col sm:flex-row gap-4 w-full'>


        {/* Gender */}
        <div className='w-full'>
          <label htmlFor="gender" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 focus:border-transparent"
            required
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Age Group */}
        <div className='w-full'>
          <label htmlFor="ageGroup" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Age Group
          </label>
          <select
            id="ageGroup"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 focus:border-transparent"
            required
          >
            <option value="">Age Group</option>
            <option value="under_18">Under 18</option>
            <option value="18_25">18-25</option>
            <option value="26_35">26-35</option>
            <option value="36_50">36-50</option>
            <option value="51_above">51 and above</option>
          </select>
        </div>

        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 focus:border-transparent"
            required
          />
        </div>


        {/* Country */}
        <div>
          <label htmlFor="country" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Country
          </label>
          <Select
            id="country"
            name="country"
            className="text-black text-sm sm:text-base"
            classNamePrefix="react-select"
            options={countries.map((c) => ({
              value: c.dialCode,
              label: `${c.flag} ${c.name} (${c.dialCode})`,
              countryCode: c.countryCode,
            }))}
            value={countries
              .map((c) => ({
                value: c.dialCode,
                label: `${c.flag} ${c.name} (${c.dialCode})`,
                countryCode: c.countryCode,
              }))
              .find((option) => option.value === formData.country)}
            onChange={(option: any) => {
              setFormData({ ...formData, country: option?.value || '', countryName: option?.label || '' });
            }}
            placeholder="Select your country"
            isSearchable
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Phone Number
          </label>
          <PhoneInput
            international
            country={selectedCountry?.countryCode as import('react-phone-number-input').Country || 'NG'}
            required
            placeholder={selectedCountry?.countryCode ? `Phone Number (${selectedCountry.dialCode})` : "Phone Number"}
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value || '' })}
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 focus:border-transparent"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block sr-only text-gray-800 text-base sm:text-lg mb-2">
            Can you tell us a bit about yourself?
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={6}
              maxLength={maxChars}
              placeholder="Can you tell us a bit about yourself?"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 focus:border-transparent resize-none"
              required
            ></textarea>
            <div className="absolute bottom-3 right-3 text-gray-400 text-xs sm:text-sm">
              {charCount}/{maxChars}
            </div>
          </div>
        </div>

        {/* reCAPTCHA */}
        <div>
          {/* Replace "YOUR_RECAPTCHA_SITE_KEY" with your actual site key */}
          <ReCAPTCHA
            sitekey="6LdFrEwrAAAAANVypGG4w4jpPR6SC-oEEq8hNraj"
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        {/* Submit Button */}
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

        {/* Feedback Message */}
        {status === "success" && (
          <p className="text-center text-green-600 text-sm">Message sent successfully!</p>
        )}
        {status === "error" && (
          <p className="text-center text-red-500 text-sm">Something went wrong. Please try again.</p>
        )}

        {/* Disclaimer */}
        <p className="text-center text-xs sm:text-sm text-gray-500">
          By submitting this form you agree to DaBible Foundation's {" "}
          <Link href="/privacy-policy" className="text-[#C8385E] hover:underline">
            Privacy Policy</Link>  {" "}
          and acknowledge that you have read our the policy.
        </p>
      </form>
    </div>
  );
} 