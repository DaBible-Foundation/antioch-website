/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { DateTime } from "luxon";
import Select from "react-select";
import * as ct from "countries-and-timezones";
import BibleStudyForm from "./BibleStudyForm";

const BIBLE_STUDY_ZONE = "America/Chicago";
const BIBLE_STUDY_TIME = "19:00";

type CountryOption = {
  value: string;
  label: string;
  country: any;
};

type ZoneOption = {
  value: string;
  label: string;
};

const featuredLocations = [
  { label: "United States (Chicago)", zone: "America/Chicago", countryCode: "US" },
  { label: "United States (New York)", zone: "America/New_York", countryCode: "US" },
  { label: "United Kingdom", zone: "Europe/London", countryCode: "GB" },
  { label: "Nigeria", zone: "Africa/Lagos", countryCode: "NG" },
  { label: "UAE", zone: "Asia/Dubai", countryCode: "AE" },
];

function getFlag(countryCode: string) {
  return countryCode
    ? countryCode.toUpperCase().replace(/./g, (char: string) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    : "";
}

function getBibleStudyDateTime(targetZone: string) {
  const [hour, minute] = BIBLE_STUDY_TIME.split(":").map(Number);
  return DateTime.now()
    .setZone(BIBLE_STUDY_ZONE)
    .set({ hour, minute, second: 0, millisecond: 0 })
    .setZone(targetZone);
}

function formatBibleStudyTime(targetZone: string) {
  const localDate = getBibleStudyDateTime(targetZone);
  return `${localDate.toFormat("h:mm a")} (${localDate.offsetNameShort})`;
}

function formatZoneLabel(zone: string) {
  const tzInfo = ct.getTimezone(zone) as any;
  const mainCities = Array.isArray(tzInfo?.mainCities) ? tzInfo.mainCities.filter(Boolean) : [];
  const cityLabel = mainCities.length ? mainCities.slice(0, 3).join(", ") : zone.replace(/_/g, " ");
  return `${cityLabel} - ${formatBibleStudyTime(zone)}`;
}

export default function CountryTimeSelector() {
  const countryList = useMemo(() => {
    return Object.values(ct.getAllCountries())
      .filter((country: any) => Array.isArray(country.timezones) && country.timezones.length > 0)
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, []);

  const countryOptions = useMemo<CountryOption[]>(() => {
    return countryList.map((country: any) => ({
      value: country.id,
      label: `${getFlag(country.id)} ${country.name}`,
      country,
    }));
  }, [countryList]);

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userZone, setUserZone] = useState(BIBLE_STUDY_ZONE);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const zone = typeof Intl !== "undefined" && Intl.DateTimeFormat().resolvedOptions().timeZone
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : BIBLE_STUDY_ZONE;
    setUserZone(zone);
  }, []);

  const zoneOptions = useMemo<ZoneOption[]>(() => {
    if (!selectedCountry?.timezones?.length) return [];

    return selectedCountry.timezones
      .filter((zone: string) => DateTime.local().setZone(zone).isValid)
      .map((zone: string) => ({
        value: zone,
        label: formatZoneLabel(zone),
      }));
  }, [selectedCountry]);

  return (
    <div>
      <div className="">
        <h3 className="text-3xl md:text-5xl text-gray-900 mb-4 font-montserrat font-extrabold mx-auto text-center">
          What time is the Bible Study in my city?
        </h3>
        <p className="text-xl font-bold text-center mb-4">
          Currently, you are closest to <span className="underline text-red-500">{userZone}</span>, and the Bible Study is at{" "}
          <span className="underline text-red-500">{formatBibleStudyTime(userZone)}</span> your time.
        </p>
      </div>

      <div className="my-6 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <label htmlFor="country" className="block mb-2 font-semibold text-center">
          Bible Study Time by Country
        </label>
        {isMounted ? (
          <Select
            id="country"
            instanceId="time-selector-country"
            inputId="time-selector-country-input"
            name="country"
            className="text-black text-sm sm:text-base mb-4"
            classNamePrefix="react-select"
            options={countryOptions}
            value={
              selectedCountry
                ? countryOptions.find((option) => option.value === selectedCountry.id) || null
                : null
            }
            onChange={(option: CountryOption | null) => {
              const country = option?.country || null;
              setSelectedCountry(country);
              setSelectedZone(country?.timezones?.length === 1 ? country.timezones[0] : "");
            }}
            placeholder="Select your country"
            isSearchable
            required
          />
        ) : (
          <div className="mb-4 h-[46px] rounded-lg border border-gray-200 bg-white" />
        )}

        {selectedCountry && zoneOptions.length > 1 && (
          <div className="mb-4">
            <label htmlFor="timezone" className="block mb-2 font-semibold">
              Select your city/timezone
            </label>
            {isMounted ? (
              <Select
                id="timezone"
                instanceId="time-selector-timezone"
                inputId="time-selector-timezone-input"
                name="timezone"
                className="text-black text-sm sm:text-base"
                classNamePrefix="react-select"
                options={zoneOptions}
                value={selectedZone ? zoneOptions.find((zone) => zone.value === selectedZone) || null : null}
                onChange={(option: ZoneOption | null) => setSelectedZone(option?.value || "")}
                placeholder="Select your city/timezone"
                isSearchable
                required
              />
            ) : (
              <div className="h-[46px] rounded-lg border border-gray-200 bg-white" />
            )}
          </div>
        )}

        {selectedCountry && zoneOptions.length === 1 && (
          <p className="mb-4 text-sm text-gray-700">
            {selectedCountry.name} uses {zoneOptions[0].label}.
          </p>
        )}

        {selectedZone && (
          <div
            className="text-lg font-bold text-gray-800 bg-green-200 rounded-sm text-center p-2 cursor-pointer hover:bg-green-300 transition-colors duration-200 border-2 border-transparent hover:border-green-400"
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsModalOpen(true);
              }
            }}
          >
            Bible Study Time: {formatBibleStudyTime(selectedZone)}
            <div className="text-sm mt-1 text-green-800">
              Click here to register for Bible Study
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 cursor-pointer right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <BibleStudyForm />
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <h4 className="text-lg font-bold text-gray-800">Other Locations</h4>
        <ul className="text-gray-800 text-sm md:text-lg mb-6 space-y-1">
          {featuredLocations.map((location) => (
            <li className="text-gray-800 text-base leading-6" key={location.label}>
              <span style={{ marginRight: "0.5em" }}>{getFlag(location.countryCode)}</span>
              {location.label} - {formatBibleStudyTime(location.zone)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
