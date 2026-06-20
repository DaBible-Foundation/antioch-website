/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"
import PhoneInput, { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';
import ReCAPTCHA from "react-google-recaptcha";
import * as ct from 'countries-and-timezones';
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

type CountryOption = {
  name: string;
  dialCode: string;
  flag: string;
  countryCode: string;
};

const RECAPTCHA_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const RECAPTCHA_PRODUCTION_SITE_KEY = "6LdFrEwrAAAAANVypGG4w4jpPR6SC-oEEq8hNraj";

function getRecaptchaSiteKey() {
  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  }

  if (process.env.NODE_ENV !== "production") {
    return RECAPTCHA_TEST_SITE_KEY;
  }

  if (typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return RECAPTCHA_TEST_SITE_KEY;
  }

  return RECAPTCHA_PRODUCTION_SITE_KEY;
}

const DEFAULT_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "US",
  countryName: "United States of America",
  dialCode: "+1",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  ageGroup: "",
  guardianFirstName: "",
  guardianLastName: "",
  guardianPhone: "",
  guardianEmail: "",
  parentSignature: "",
  parentConsentAccepted: false,
  knowsAntioch: "",
  contactPreference: "",
  otherContactDetail: ""
};

const TEEN_AGE_GROUP = "Teens (ages 12-15)";
const YOUNG_ADULT_AGE_GROUP = "Young Adults (ages 16-18)";
const ADULT_AGE_GROUP = "Adults (18 years and older)";
const US_STATES = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
  ["DC", "District of Columbia"],
];

export default function BibleStudyForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingSignature = useRef(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const countries = useMemo<CountryOption[]>(() => {
    return getCountries()
      .reduce<CountryOption[]>((options, countryCode) => {
        const country = ct.getCountry(countryCode);
        if (!country?.name) return options;

        const flag = countryCode
          .toUpperCase()
          .replace(/./g, (ch: string) => String.fromCodePoint(127397 + ch.charCodeAt(0)));

        options.push({
          name: country.name,
          dialCode: `+${getCountryCallingCode(countryCode)}`,
          flag,
          countryCode,
        });

        return options;
      }, [])
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getSignaturePoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const saveSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    setFormData(prev => ({
      ...prev,
      parentSignature: canvas.toDataURL("image/png"),
    }));
  };

  const startSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    const point = getSignaturePoint(event);
    if (!canvas || !point) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    isDrawingSignature.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const drawSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingSignature.current) return;

    const canvas = signatureCanvasRef.current;
    const point = getSignaturePoint(event);
    if (!canvas || !point) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const endSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingSignature.current) return;

    isDrawingSignature.current = false;
    signatureCanvasRef.current?.releasePointerCapture(event.pointerId);
    saveSignature();
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context?.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({ ...prev, parentSignature: "" }));
  };

  const formattedAddress = [
    formData.streetAddress.trim(),
    formData.city.trim(),
    [formData.state, formData.zipCode.trim()].filter(Boolean).join(" "),
  ].filter(Boolean).join(", ");
  const isUnitedStates = formData.countryCode === "US";
  const isTeenRegistration = formData.ageGroup === TEEN_AGE_GROUP;
  const isPaidTeenRegistration = isTeenRegistration && isUnitedStates;

  const registrationPayload = {
    firstName: formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1).toLowerCase(),
    lastName: formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1).toLowerCase(),
    email: formData.email,
    country: formData.countryName,
    countryCode: formData.countryCode,
    dialCode: formData.dialCode,
    phone: formData.phone,
    address: formattedAddress,
    streetAddress: formData.streetAddress,
    city: formData.city,
    state: formData.state,
    zipCode: formData.zipCode,
    ageGroup: formData.ageGroup,
    guardianFirstName: formData.guardianFirstName,
    guardianLastName: formData.guardianLastName,
    guardianPhone: formData.guardianPhone,
    guardianEmail: formData.guardianEmail,
    parentSignature: formData.parentSignature,
    parentConsentAccepted: formData.parentConsentAccepted,
    knowsAntioch: formData.knowsAntioch,
    contactPreference: formData.contactPreference,
    otherContactDetail: formData.otherContactDetail,
    recaptchaToken,
  };

  const ageGroupParam = formData.ageGroup === TEEN_AGE_GROUP
    ? "teens"
    : formData.ageGroup === YOUNG_ADULT_AGE_GROUP
      ? "young-adults"
      : formData.ageGroup === ADULT_AGE_GROUP
        ? "adults"
        : "";

  const congratulationsParams = new URLSearchParams({
    ageGroup: ageGroupParam,
    knowsAntioch: formData.knowsAntioch,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const missingFields: string[] = [];
    if (!formData.firstName.trim()) missingFields.push("First name");
    if (!formData.lastName.trim()) missingFields.push("Last name");
    if (!formData.email.trim()) missingFields.push("Email");
    if (!formData.countryCode) missingFields.push("Country");
    if (!formData.phone.trim()) missingFields.push("Phone number");
    if (!formData.streetAddress.trim()) missingFields.push("Street address");
    if (!formData.city.trim()) missingFields.push("City");
    if (!formData.state.trim()) missingFields.push(isUnitedStates ? "State" : "State, province, or region");
    if (!formData.zipCode.trim()) missingFields.push(isUnitedStates ? "ZIP code" : "Postal code");
    if (!formData.ageGroup) missingFields.push("Age group");
    if (!formData.knowsAntioch) missingFields.push("Antioch or DaBible Foundation familiarity");
    if (isTeenRegistration) {
      if (!formData.guardianFirstName.trim()) missingFields.push("Parent or guardian first name");
      if (!formData.guardianLastName.trim()) missingFields.push("Parent or guardian last name");
      if (!formData.guardianPhone.trim()) missingFields.push("Parent or guardian phone number");
      if (!formData.guardianEmail.trim()) missingFields.push("Parent or guardian email");
      if (!formData.parentSignature.trim()) missingFields.push("Parent or guardian signature");
      if (!formData.parentConsentAccepted) missingFields.push("Parent or guardian consent");
    }
    if (!formData.contactPreference) missingFields.push("Preferred contact method");
    if (formData.contactPreference === "Other" && !formData.otherContactDetail.trim()) {
      missingFields.push("Other contact method");
    }

    if (missingFields.length) {
      alert(`Please complete: ${missingFields.join(", ")}.`);
      setStatus("idle");
      return;
    }

    if (!recaptchaToken) {
      alert("Please verify you are not a robot.");
      setStatus("idle");
      return;
    }

    try {
      const endpoint = isPaidTeenRegistration
        ? "/api/bible-study/checkout"
        : "/api/bible-study";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
          return;
        }
        setStatus("success");
        setFormData(DEFAULT_FORM_DATA);
        setRecaptchaToken(null);
        router.push(`/congratulations?${congratulationsParams.toString()}`);
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

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
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
              autoComplete="given-name"
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
              autoComplete="family-name"
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
            autoComplete="email"
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block sr-only">Country</label>
          {isMounted ? (
            <Select
              id="country"
              inputId="bible-study-country-input"
              instanceId="bible-study-country"
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
                  state: '',
                  zipCode: '',
                }));
              }}
              placeholder="Select your country"
              isSearchable
              required
            />
          ) : (
            <div className="h-[46px] rounded-lg border border-gray-200 bg-white" />
          )}
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
            id="phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="streetAddress" className="block sr-only">Street Address</label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={handleInputChange}
              autoComplete="address-line1"
              className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-4">
            <div>
              <label htmlFor="city" className="block sr-only">City</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                autoComplete="address-level2"
                className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block sr-only">
                {isUnitedStates ? "State" : "State, Province, or Region"}
              </label>
              {isUnitedStates ? (
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  autoComplete="address-level1"
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
                  required
                >
                  <option value="" disabled>State</option>
                  {US_STATES.map(([abbreviation, name]) => (
                    <option key={abbreviation} value={abbreviation}>
                      {abbreviation} - {name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="State / Province / Region"
                  value={formData.state}
                  onChange={handleInputChange}
                  autoComplete="address-level1"
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
                  required
                />
              )}
            </div>
            <div>
              <label htmlFor="zipCode" className="block sr-only">
                {isUnitedStates ? "ZIP Code" : "Postal Code"}
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                placeholder={isUnitedStates ? "ZIP Code" : "Postal Code"}
                value={formData.zipCode}
                onChange={handleInputChange}
                autoComplete="postal-code"
                inputMode="numeric"
                className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="ageGroup" className="block sr-only">Age Group</label>
          <select
            id="ageGroup"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                ageGroup: value,
                guardianFirstName: value === TEEN_AGE_GROUP ? prev.guardianFirstName : "",
                guardianLastName: value === TEEN_AGE_GROUP ? prev.guardianLastName : "",
                guardianPhone: value === TEEN_AGE_GROUP ? prev.guardianPhone : "",
                guardianEmail: value === TEEN_AGE_GROUP ? prev.guardianEmail : "",
                parentSignature: value === TEEN_AGE_GROUP ? prev.parentSignature : "",
                parentConsentAccepted: value === TEEN_AGE_GROUP ? prev.parentConsentAccepted : false,
              }));
            }}
            required
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
          >
            <option value="" disabled>Age Group</option>
            <option value="Teens (ages 12-15)">Teens (ages 12-15)</option>
            <option value={YOUNG_ADULT_AGE_GROUP}>Young Adults (ages 16-18)</option>
            <option value={ADULT_AGE_GROUP}>Adults (18 years and older)</option>
          </select>
        </div>

        <div>
          <label htmlFor="knowsAntioch" className="block sr-only">Are you new to Antioch or DaBible Foundation?</label>
          <select
            id="knowsAntioch"
            name="knowsAntioch"
            value={formData.knowsAntioch}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
          >
            <option value="" disabled>Are you new to Antioch or DaBible Foundation?</option>
            <option value="yes">No, I already know Antioch or DaBible Foundation</option>
            <option value="no">Yes, I am new to both</option>
          </select>
        </div>

        {formData.ageGroup === TEEN_AGE_GROUP && (
          <div className="space-y-4 rounded-lg border border-[#C8385E]/20 bg-[#FFF7FA] p-4">
            <p className="text-sm text-gray-700">
              {isPaidTeenRegistration
                ? "Teen registration is $50 for participants in the United States and requires parent or guardian consent."
                : "Teen registration requires parent or guardian consent."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label htmlFor="guardianFirstName" className="block sr-only">Parent or guardian first name</label>
                <input
                  type="text"
                  id="guardianFirstName"
                  name="guardianFirstName"
                  placeholder="Parent/Guardian First Name"
                  value={formData.guardianFirstName}
                  onChange={handleInputChange}
                  autoComplete="section-guardian given-name"
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
                  required
                />
              </div>
              <div className="w-full">
                <label htmlFor="guardianLastName" className="block sr-only">Parent or guardian last name</label>
                <input
                  type="text"
                  id="guardianLastName"
                  name="guardianLastName"
                  placeholder="Parent/Guardian Last Name"
                  value={formData.guardianLastName}
                  onChange={handleInputChange}
                  autoComplete="section-guardian family-name"
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label htmlFor="guardianPhone" className="block sr-only">Parent or guardian phone number</label>
                <input
                  type="tel"
                  id="guardianPhone"
                  name="guardianPhone"
                  placeholder="Parent/Guardian Phone Number"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  inputMode="tel"
                  autoComplete="section-guardian tel"
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
                  required
                />
              </div>
              <div className="w-full">
                <label htmlFor="guardianEmail" className="block sr-only">Parent or guardian email</label>
                <input
                  type="email"
                  id="guardianEmail"
                  name="guardianEmail"
                  placeholder="Parent/Guardian Email"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                  autoComplete="section-guardian email"
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80 bg-white"
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="parentSignaturePad" className="text-sm font-medium text-gray-700">
                  Parent/Guardian Signature
                </label>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-sm font-medium text-[#C8385E] hover:underline"
                >
                  Clear
                </button>
              </div>
              <canvas
                ref={signatureCanvasRef}
                id="parentSignaturePad"
                width={720}
                height={220}
                onPointerDown={startSignature}
                onPointerMove={drawSignature}
                onPointerUp={endSignature}
                onPointerLeave={endSignature}
                onPointerCancel={endSignature}
                className="h-40 w-full touch-none rounded-lg border border-gray-200 bg-white"
                aria-label="Draw parent or guardian signature"
              />
              <p className="mt-2 text-xs text-gray-500">
                Use your mouse, trackpad, or finger to sign above.
              </p>
            </div>
            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                name="parentConsentAccepted"
                checked={formData.parentConsentAccepted}
                onChange={(e) => setFormData(prev => ({ ...prev, parentConsentAccepted: e.target.checked }))}
                className="mt-1 h-4 w-4 accent-[#C8385E]"
                required
              />
              <span>
                I am the parent or legal guardian and I consent to this teen participating in Antioch Bible Study.
                {isPaidTeenRegistration ? " I understand the teen registration fee is $50." : ""}
              </span>
            </label>
          </div>
        )}

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
            sitekey={getRecaptchaSiteKey()}
            onChange={(token) => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
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
            {status === "submitting"
              ? "Sending..."
              : isPaidTeenRegistration
                ? "Pay $50 and Register"
                : "Submit"}
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
