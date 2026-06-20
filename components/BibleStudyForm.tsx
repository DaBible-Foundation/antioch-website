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
import {
  AlertCircle,
  BadgePercent,
  Building2,
  CheckCircle2,
  Globe2,
  Hash,
  Home,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Signature,
  User,
  Users,
} from "lucide-react";

type CountryOption = {
  name: string;
  dialCode: string;
  flag: string;
  countryCode: string;
};

type TeenParticipant = {
  firstName: string;
  lastName: string;
};

type AppliedDiscount = {
  code: string;
  description: string;
  discountAmountCents: number;
  subtotalCents: number;
  totalCents: number;
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
  otherContactDetail: "",
  discountCode: "",
};

const DEFAULT_TEEN_PARTICIPANT: TeenParticipant = {
  firstName: "",
  lastName: "",
};

const TEEN_AGE_GROUP = "Teens (ages 12-15)";
const YOUNG_ADULT_AGE_GROUP = "Young Adults (ages 16-18)";
const ADULT_AGE_GROUP = "Adults (18 years and older)";
const MAX_TEEN_PARTICIPANTS = 5;
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

const fieldIconClassName = "pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400";
const fieldInputClassName = "w-full px-4 py-3 pl-11 border text-black border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C8385E]/80";
const fieldSelectClassName = `${fieldInputClassName} bg-white`;

export default function BibleStudyForm() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [teenParticipants, setTeenParticipants] = useState<TeenParticipant[]>([
    { ...DEFAULT_TEEN_PARTICIPANT },
  ]);
  const [currentStep, setCurrentStep] = useState(1);

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [discountStatus, setDiscountStatus] = useState<"idle" | "checking" | "applied" | "error">("idle");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountMessage, setDiscountMessage] = useState("");
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

  const handleDiscountCodeChange = (value: string) => {
    setFormData(prev => ({ ...prev, discountCode: value }));
    setAppliedDiscount(null);
    setDiscountStatus("idle");
    setDiscountMessage("");
  };

  const updateTeenParticipant = (index: number, field: keyof TeenParticipant, value: string) => {
    setTeenParticipants(prev => prev.map((participant, participantIndex) => (
      participantIndex === index ? { ...participant, [field]: value } : participant
    )));
  };

  const addTeenParticipant = () => {
    setTeenParticipants(prev => (
      prev.length >= MAX_TEEN_PARTICIPANTS ? prev : [...prev, { ...DEFAULT_TEEN_PARTICIPANT }]
    ));
  };

  const removeTeenParticipant = (index: number) => {
    setTeenParticipants(prev => (
      prev.length <= 1 ? prev : prev.filter((_, participantIndex) => participantIndex !== index)
    ));
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
  const validTeenParticipants = teenParticipants
    .map(participant => ({
      firstName: participant.firstName.trim(),
      lastName: participant.lastName.trim(),
    }))
    .filter(participant => participant.firstName || participant.lastName);
  const teenParticipantCount = isTeenRegistration ? validTeenParticipants.length : 0;
  const teenRegistrationTotal = teenParticipantCount * 50;
  const teenRegistrationTotalCents = teenParticipantCount * 5000;
  const discountAmountCents = appliedDiscount?.discountAmountCents || 0;
  const estimatedTotalCents = appliedDiscount?.totalCents ?? teenRegistrationTotalCents;
  const firstTeenParticipant = validTeenParticipants[0] || DEFAULT_TEEN_PARTICIPANT;

  useEffect(() => {
    setAppliedDiscount(null);
    setDiscountStatus("idle");
    setDiscountMessage("");
  }, [teenRegistrationTotalCents]);

  const formatCurrency = (amountCents: number) => `$${(amountCents / 100).toFixed(2)}`;

  const applyDiscountCode = async () => {
    const discountCode = formData.discountCode.trim();

    if (!discountCode) {
      setAppliedDiscount(null);
      setDiscountStatus("error");
      setDiscountMessage("Please enter a discount code.");
      return;
    }

    if (!teenRegistrationTotalCents) {
      setAppliedDiscount(null);
      setDiscountStatus("error");
      setDiscountMessage("Add at least one child before applying a discount.");
      return;
    }

    setDiscountStatus("checking");
    setDiscountMessage("");

    try {
      const response = await fetch("/api/bible-study/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discountCode,
          amountCents: teenRegistrationTotalCents,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setAppliedDiscount(null);
        setDiscountStatus("error");
        setDiscountMessage(result?.error || "This discount code could not be applied.");
        return;
      }

      setAppliedDiscount(result);
      setDiscountStatus("applied");
      setDiscountMessage(`Coupon applied: ${result.description}`);
    } catch (error) {
      console.error("Discount validation error:", error);
      setAppliedDiscount(null);
      setDiscountStatus("error");
      setDiscountMessage("We could not check this discount code. Please try again.");
    }
  };

  const registrationPayload = {
    firstName: isTeenRegistration
      ? firstTeenParticipant.firstName.charAt(0).toUpperCase() + firstTeenParticipant.firstName.slice(1).toLowerCase()
      : formData.firstName.charAt(0).toUpperCase() + formData.firstName.slice(1).toLowerCase(),
    lastName: isTeenRegistration
      ? firstTeenParticipant.lastName.charAt(0).toUpperCase() + firstTeenParticipant.lastName.slice(1).toLowerCase()
      : formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1).toLowerCase(),
    email: isTeenRegistration ? formData.guardianEmail : formData.email,
    country: formData.countryName,
    countryCode: formData.countryCode,
    dialCode: formData.dialCode,
    phone: isTeenRegistration ? formData.guardianPhone : formData.phone,
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
    discountCode: isPaidTeenRegistration ? formData.discountCode.trim() : "",
    participants: isTeenRegistration
      ? validTeenParticipants.map(participant => ({
          firstName: participant.firstName.charAt(0).toUpperCase() + participant.firstName.slice(1).toLowerCase(),
          lastName: participant.lastName.charAt(0).toUpperCase() + participant.lastName.slice(1).toLowerCase(),
          email: formData.guardianEmail,
          phone: formData.guardianPhone,
        }))
      : undefined,
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

  const totalSteps = isTeenRegistration ? 5 : 4;
  const stepLabels = isTeenRegistration
    ? ["Age Group", "Children", "Address", "Guardian", "Finish"]
    : ["Age Group", "Your Details", "Address", "Finish"];

  const validateCurrentStep = () => {
    const missingFields: string[] = [];

    if (currentStep === 1 && !formData.ageGroup) {
      missingFields.push("Age group");
    }

    if (currentStep === 2) {
      if (isTeenRegistration) {
        teenParticipants.forEach((participant, index) => {
          if (!participant.firstName.trim()) missingFields.push(`Child ${index + 1} first name`);
          if (!participant.lastName.trim()) missingFields.push(`Child ${index + 1} last name`);
        });
      } else {
        if (!formData.firstName.trim()) missingFields.push("First name");
        if (!formData.lastName.trim()) missingFields.push("Last name");
        if (!formData.email.trim()) missingFields.push("Email");
        if (!formData.phone.trim()) missingFields.push("Phone number");
      }
    }

    if (currentStep === 3) {
      if (!formData.countryCode) missingFields.push("Country");
      if (!formData.streetAddress.trim()) missingFields.push("Street address");
      if (!formData.city.trim()) missingFields.push("City");
      if (!formData.state.trim()) missingFields.push(isUnitedStates ? "State" : "State, province, or region");
      if (!formData.zipCode.trim()) missingFields.push(isUnitedStates ? "ZIP code" : "Postal code");
      if (!formData.knowsAntioch) missingFields.push("Antioch or DaBible Foundation familiarity");
    }

    if (isTeenRegistration && currentStep === 4) {
      if (!formData.guardianFirstName.trim()) missingFields.push("Parent or guardian first name");
      if (!formData.guardianLastName.trim()) missingFields.push("Parent or guardian last name");
      if (!formData.guardianPhone.trim()) missingFields.push("Parent or guardian phone number");
      if (!formData.guardianEmail.trim()) missingFields.push("Parent or guardian email");
      if (!formData.parentSignature.trim()) missingFields.push("Parent or guardian signature");
      if (!formData.parentConsentAccepted) missingFields.push("Parent or guardian consent");
    }

    if (missingFields.length) {
      alert(`Please complete: ${missingFields.join(", ")}.`);
      return false;
    }

    return true;
  };

  const goToNextStep = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const missingFields: string[] = [];
    if (isTeenRegistration) {
      if (!validTeenParticipants.length) {
        missingFields.push("At least one child");
      }
      teenParticipants.forEach((participant, index) => {
        if (!participant.firstName.trim()) missingFields.push(`Child ${index + 1} first name`);
        if (!participant.lastName.trim()) missingFields.push(`Child ${index + 1} last name`);
      });
    } else {
      if (!formData.firstName.trim()) missingFields.push("First name");
      if (!formData.lastName.trim()) missingFields.push("Last name");
      if (!formData.email.trim()) missingFields.push("Email");
      if (!formData.phone.trim()) missingFields.push("Phone number");
    }
    if (!formData.countryCode) missingFields.push("Country");
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

    if (
      isPaidTeenRegistration &&
      formData.discountCode.trim() &&
      appliedDiscount?.code.toLowerCase() !== formData.discountCode.trim().toLowerCase()
    ) {
      alert("Please click Apply Coupon before continuing to payment.");
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
        setTeenParticipants([{ ...DEFAULT_TEEN_PARTICIPANT }]);
        setCurrentStep(1);
        setAppliedDiscount(null);
        setDiscountStatus("idle");
        setDiscountMessage("");
        setRecaptchaToken(null);
        router.push(`/congratulations?${congratulationsParams.toString()}`);
      } else {
        setStatus("error");
        const result = await response.json().catch(() => null);
        alert(result?.error || "Something went wrong. Please try again.");
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

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{stepLabels[currentStep - 1]}</span>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}>
          {stepLabels.map((label, index) => (
            <div
              key={label}
              className={`h-2 rounded-full ${index + 1 <= currentStep ? "bg-[#C8385E]" : "bg-gray-200"}`}
              aria-label={label}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
        {currentStep === 1 && (
          <div className="space-y-4">
            <label htmlFor="ageGroup" className="block text-sm font-semibold text-gray-700">
              Who are you registering?
            </label>
            <div className="relative">
              <Users className={fieldIconClassName} aria-hidden="true" />
              <select
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentStep(1);
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
                className={fieldSelectClassName}
              >
                <option value="" disabled>Select age group</option>
                <option value={TEEN_AGE_GROUP}>Teenagers, ages 12-15</option>
                <option value={YOUNG_ADULT_AGE_GROUP}>Young Adults, ages 16-18</option>
                <option value={ADULT_AGE_GROUP}>Adults, 18 years and older</option>
              </select>
            </div>
            {isTeenRegistration && (
              <p className="text-sm text-gray-600">
                Parents or guardians can register up to {MAX_TEEN_PARTICIPANTS} children in one submission.
              </p>
            )}
          </div>
        )}

        {currentStep === 2 && isTeenRegistration && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Children Being Registered</h4>
              <p className="text-sm text-gray-600">
                Add each child who will join the teen Bible Study.
              </p>
            </div>
            {teenParticipants.map((participant, index) => (
              <div key={index} className="space-y-3 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-700">Child {index + 1}</p>
                  {teenParticipants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeenParticipant(index)}
                      className="text-sm font-medium text-[#C8385E] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full">
                    <User className={fieldIconClassName} aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Child First Name"
                      value={participant.firstName}
                      onChange={(event) => updateTeenParticipant(index, "firstName", event.target.value)}
                      autoComplete={`section-child-${index} given-name`}
                      className={fieldInputClassName}
                      required
                    />
                  </div>
                  <div className="relative w-full">
                    <User className={fieldIconClassName} aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Child Last Name"
                      value={participant.lastName}
                      onChange={(event) => updateTeenParticipant(index, "lastName", event.target.value)}
                      autoComplete={`section-child-${index} family-name`}
                      className={fieldInputClassName}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTeenParticipant}
              disabled={teenParticipants.length >= MAX_TEEN_PARTICIPANTS}
              className="w-full rounded-full border border-[#C8385E] px-4 py-3 text-sm font-semibold text-[#C8385E] transition-colors hover:bg-[#FFF7FA] disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              Add Another Child
            </button>
          </div>
        )}

        {currentStep === 2 && !isTeenRegistration && (
          <div className="space-y-4">
            <div className='flex flex-col sm:flex-row gap-4 w-full'>
              <div className="relative w-full">
                <User className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  autoComplete="given-name"
                  className={fieldInputClassName}
                  required
                />
              </div>
              <div className="relative w-full">
                <User className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  autoComplete="family-name"
                  className={fieldInputClassName}
                  required
                />
              </div>
            </div>
            <div className="relative">
              <Mail className={fieldIconClassName} aria-hidden="true" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className={fieldInputClassName}
                required
              />
            </div>
            <div className="relative">
              <Phone className={fieldIconClassName} aria-hidden="true" />
              <PhoneInput
                international
                country={phoneCountry}
                required
                placeholder={selectedCountry ? `Phone Number (${selectedCountry.dialCode})` : "Phone Number"}
                value={formData.phone}
                onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
                id="phone"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                className={fieldInputClassName}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="relative">
              <Globe2 className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
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
                  styles={{
                    control: (base) => ({ ...base, paddingLeft: "2rem" }),
                    valueContainer: (base) => ({ ...base, paddingLeft: "0.5rem" }),
                  }}
                />
              ) : (
                <div className="h-[46px] rounded-lg border border-gray-200 bg-white" />
              )}
            </div>
            <div className="relative">
              <Home className={fieldIconClassName} aria-hidden="true" />
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                placeholder="Street Address"
                value={formData.streetAddress}
                onChange={handleInputChange}
                autoComplete="address-line1"
                className={fieldInputClassName}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-4">
              <div className="relative">
                <Building2 className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  autoComplete="address-level2"
                  className={fieldInputClassName}
                  required
                />
              </div>
              {isUnitedStates ? (
                <div className="relative">
                  <MapPin className={fieldIconClassName} aria-hidden="true" />
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    autoComplete="address-level1"
                    className={fieldSelectClassName}
                    required
                  >
                    <option value="" disabled>State</option>
                    {US_STATES.map(([abbreviation, name]) => (
                      <option key={abbreviation} value={abbreviation}>
                        {abbreviation} - {name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="relative">
                  <MapPin className={fieldIconClassName} aria-hidden="true" />
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="State / Province / Region"
                    value={formData.state}
                    onChange={handleInputChange}
                    autoComplete="address-level1"
                    className={fieldInputClassName}
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Hash className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder={isUnitedStates ? "ZIP Code" : "Postal Code"}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  className={fieldInputClassName}
                  required
                />
              </div>
            </div>
            <div className="relative">
              <ShieldCheck className={fieldIconClassName} aria-hidden="true" />
              <select
                id="knowsAntioch"
                name="knowsAntioch"
                value={formData.knowsAntioch}
                onChange={handleInputChange}
                required
                className={fieldSelectClassName}
              >
                <option value="" disabled>Are you new to Antioch or DaBible Foundation?</option>
                <option value="yes">No, I already know Antioch or DaBible Foundation</option>
                <option value="no">Yes, I am new to both</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 4 && isTeenRegistration && (
          <div className="space-y-4 rounded-lg border border-[#C8385E]/20 bg-[#FFF7FA] p-4">
            <p className="text-sm text-gray-700">
              {isPaidTeenRegistration
                ? `Teen registration is $50 per child in the United States. Your current total is $${teenRegistrationTotal}.`
                : "Teen registration requires parent or guardian consent."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full">
                <User className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="text"
                  id="guardianFirstName"
                  name="guardianFirstName"
                  placeholder="Parent/Guardian First Name"
                  value={formData.guardianFirstName}
                  onChange={handleInputChange}
                  autoComplete="section-guardian given-name"
                  className={`${fieldInputClassName} bg-white`}
                  required
                />
              </div>
              <div className="relative w-full">
                <User className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="text"
                  id="guardianLastName"
                  name="guardianLastName"
                  placeholder="Parent/Guardian Last Name"
                  value={formData.guardianLastName}
                  onChange={handleInputChange}
                  autoComplete="section-guardian family-name"
                  className={`${fieldInputClassName} bg-white`}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full">
                <Phone className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="tel"
                  id="guardianPhone"
                  name="guardianPhone"
                  placeholder="Parent/Guardian Phone Number"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  inputMode="tel"
                  autoComplete="section-guardian tel"
                  className={`${fieldInputClassName} bg-white`}
                  required
                />
              </div>
              <div className="relative w-full">
                <Mail className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="email"
                  id="guardianEmail"
                  name="guardianEmail"
                  placeholder="Parent/Guardian Email"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                  autoComplete="section-guardian email"
                  className={`${fieldInputClassName} bg-white`}
                  required
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="parentSignaturePad" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Signature className="h-4 w-4 text-gray-500" aria-hidden="true" />
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
                I am the parent or legal guardian and I consent to the child or children listed above participating in Antioch Bible Study.
                {isPaidTeenRegistration ? ` I understand the teen registration fee is $50 per child.` : ""}
              </span>
            </label>
          </div>
        )}

        {currentStep === totalSteps && (
          <div className="space-y-4">
            <div className="relative">
              <MessageCircle className={fieldIconClassName} aria-hidden="true" />
              <select
                id="contactPreference"
                name="contactPreference"
                value={formData.contactPreference}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    contactPreference: val,
                    otherContactDetail: val === "Other" ? prev.otherContactDetail : ""
                  }));
                }}
                required
                className={fieldSelectClassName}
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
              <div className="relative">
                <MessageCircle className={fieldIconClassName} aria-hidden="true" />
                <input
                  type="text"
                  id="otherContactDetail"
                  name="otherContactDetail"
                  placeholder="e.g. Signal, WeChat, etc."
                  value={formData.otherContactDetail}
                  onChange={handleInputChange}
                  className={fieldInputClassName}
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

            {isPaidTeenRegistration && (
              <div className="space-y-3 rounded-lg bg-[#FFF7FA] px-4 py-3">
                <label htmlFor="discountCode" className="block text-sm font-semibold text-gray-800">
                  Discount Code
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative w-full">
                    <BadgePercent className={fieldIconClassName} aria-hidden="true" />
                    <input
                      type="text"
                      id="discountCode"
                      name="discountCode"
                      placeholder="Enter discount code, if you have one"
                      value={formData.discountCode}
                      onChange={(event) => handleDiscountCodeChange(event.target.value)}
                      autoComplete="off"
                      className={`${fieldInputClassName} bg-white`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyDiscountCode}
                    disabled={discountStatus === "checking" || !formData.discountCode.trim()}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {discountStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    Apply
                  </button>
                </div>
                {discountMessage && (
                  <p className={`flex items-center gap-2 text-sm font-semibold ${
                    discountStatus === "applied" ? "text-green-700" : "text-red-600"
                  }`}>
                    {discountStatus === "applied" ? (
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    )}
                    {discountMessage}
                  </p>
                )}
                <div className="space-y-2 rounded-lg bg-white p-3 text-sm text-gray-800">
                  <div className="flex items-center justify-between gap-4">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatCurrency(teenRegistrationTotalCents)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Discount</span>
                    <span className="font-semibold text-green-700">-{formatCurrency(discountAmountCents)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 text-base font-bold">
                    <span>Total due today</span>
                    <span>{formatCurrency(estimatedTotalCents)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="w-full rounded-full bg-[#C8385E] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C8385E]/90"
            >
              Continue
            </button>
          ) : (
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
                  ? `Pay ${formatCurrency(estimatedTotalCents)} and Register`
                  : "Submit"}
            </button>
          )}
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
