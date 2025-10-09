/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { DateTime } from "luxon";
import Select from 'react-select';
import * as ct from 'countries-and-timezones';
import BibleStudyForm from './BibleStudyForm'; // Import the form component

const CST_TIME = "21:00"; // 9PM CST
const CST_ZONE = "America/Chicago";

function getLocalTime(targetZone: string) {
  const [hour, minute] = CST_TIME.split(":").map(Number);
  const now = DateTime.now();
  // Create a DateTime for today at 9PM CST
  const cstDate = now.set({ hour, minute, second: 0, millisecond: 0 }).setZone(CST_ZONE, { keepLocalTime: true });
  // Convert to target zone
  const localDate = cstDate.setZone(targetZone);
  return localDate.toFormat("h:mm a");
}

// Developer test: log Bible Study time for key zones
function testBibleStudyTimes() {
  const zonesToTest = [
    "America/Chicago", // CST reference
    "America/New_York", // Eastern
    "America/Denver", // Mountain
    "America/Los_Angeles", // Pacific
    "Europe/London", // UK
    "Africa/Lagos", // Nigeria
    "Asia/Dubai", // UAE
    "Asia/Tokyo", // Japan
  ];
  zonesToTest.forEach(zone => {
    console.log(`Bible Study Time in ${zone}:`, getLocalTime(zone));
  });
}
testBibleStudyTimes();

export default function CountryTimeSelector() {
  // Bible Study event time in CST
  const CST_ZONE = "America/Chicago";
  const CST_TIME = "21:00"; // 9PM CST
  // Key locations to display
  const locations = [
    { label: "United States (Chicago)", zone: "America/Chicago" },
    { label: "United States (New York)", zone: "America/New_York" },
    { label: "United Kingdom", zone: "Europe/London" },
    { label: "Nigeria", zone: "Africa/Lagos" },
    { label: "UAE", zone: "Asia/Dubai" },
  ];
  // Use shared utility for local time
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getLocalTimeForZone } = require("@/lib/getLocalTimeForZone");
  const countryList = Object.values(ct.getAllCountries());
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  // Hydration-safe userZone and userLocalTime
  const [userZone, setUserZone] = useState(CST_ZONE);
  const [userLocalTime, setUserLocalTime] = useState<string>("");
  React.useEffect(() => {
    const zone = typeof Intl !== "undefined" && Intl.DateTimeFormat().resolvedOptions().timeZone
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : CST_ZONE;
    setUserZone(zone);
    setUserLocalTime(getLocalTimeForZone({ baseZone: CST_ZONE, baseTime: CST_TIME, targetZone: zone }));
  }, []);

  // Helper to get flag emoji from country code
  function getFlag(countryCode: string) {
    return countryCode
      ? countryCode.toUpperCase().replace(/./g, (char: string) => String.fromCodePoint(127397 + char.charCodeAt(0)))
      : "";
  }

  // Region-to-timezone mapping for US (expand for other countries)
  const regionTimeZones: Record<string, Record<string, string>> = {
    US: {
      "Alabama": "America/Chicago",
      "Alaska": "America/Anchorage",
      "Arizona": "America/Phoenix",
      "California": "America/Los_Angeles",
      "Colorado": "America/Denver",
      "Connecticut": "America/New_York",
      "Delaware": "America/New_York",
      "Florida": "America/New_York",
      "Georgia": "America/New_York",
      "Hawaii": "Pacific/Honolulu",
      "Idaho": "America/Boise",
      "Illinois": "America/Chicago",
      "Indiana": "America/Indiana/Indianapolis",
      "Iowa": "America/Chicago",
      "Kansas": "America/Chicago",
      "Kentucky": "America/New_York",
      "Louisiana": "America/Chicago",
      "Maine": "America/New_York",
      "Maryland": "America/New_York",
      "Massachusetts": "America/New_York",
      "Michigan": "America/Detroit",
      "Minnesota": "America/Chicago",
      "Mississippi": "America/Chicago",
      "Missouri": "America/Chicago",
      "Montana": "America/Denver",
      "Nebraska": "America/Chicago",
      "Nevada": "America/Los_Angeles",
      "New Hampshire": "America/New_York",
      "New Jersey": "America/New_York",
      "New Mexico": "America/Denver",
      "New York": "America/New_York",
      "North Carolina": "America/New_York",
      "North Dakota": "America/Chicago",
      "Ohio": "America/New_York",
      "Oklahoma": "America/Chicago",
      "Oregon": "America/Los_Angeles",
      "Pennsylvania": "America/New_York",
      "Rhode Island": "America/New_York",
      "South Carolina": "America/New_York",
      "South Dakota": "America/Chicago",
      "Tennessee": "America/Chicago",
      "Texas": "America/Chicago",
      "Utah": "America/Denver",
      "Vermont": "America/New_York",
      "Virginia": "America/New_York",
      "Washington": "America/Los_Angeles",
      "West Virginia": "America/New_York",
      "Wisconsin": "America/Chicago",
      "Wyoming": "America/Denver"
    }
    // Add mappings for other countries here
  };

  // If country has region mapping, show region dropdown
  const regions = selectedCountry && regionTimeZones[selectedCountry.id]
    ? Object.keys(regionTimeZones[selectedCountry.id]).map(region => ({ value: region, label: region }))
    : [];

  // If region selected, use mapped time zone; else fallback to time zone dropdown
  type ZoneOption = { value: string; label: string };
  const zones: ZoneOption[] = selectedCountry && !regions.length
    ? selectedCountry.timezones.map((tz: string): ZoneOption => {
        const tzInfo = ct.getTimezone(tz) as any;
        let label = tz;
        if (tzInfo && Array.isArray(tzInfo.mainCities) && tzInfo.mainCities.length > 0) {
          label = `${tz} (${tzInfo.mainCities.join(", ")})`;
        }
        return {
          value: tz,
          label,
        };
      })
    : [];

  return (
    <div>
        <div className="">
            <h3 className="text-3xl md:text-5xl text-gray-900 mb-4 font-montserrat font-extrabold mx-auto text-center">What time is the Bible Study in my city?</h3>
            <p className="text-xl font-bold text-center mb-4">Currently, you are closest to <span className="underline text-red-500">{userZone}</span>, and the Bible Study is at <span className="underline text-red-500">{userLocalTime}</span> your time.</p>
        </div>
        <div className="my-6 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <label htmlFor="country" className="block mb-2 font-semibold text-center">Bible Study Time by Country</label>
        <Select
            id="country"
            instanceId="time-selector-country"
            inputId="time-selector-country-input"
            name="country"
            className="text-black text-sm sm:text-base mb-4"
            classNamePrefix="react-select"
            options={countryList.map((c: any) => ({
            value: c.id,
            label: `${getFlag(c.id)} ${c.name}`,
            }))}
            value={selectedCountry ? { value: selectedCountry.id, label: `${getFlag(selectedCountry.id)} ${selectedCountry.name}` } : null}
            onChange={(option: any) => {
            setSelectedCountry(countryList.find((c: any) => c.id === option.value));
            setSelectedZone("");
            }}
            placeholder="Select your country"
            isSearchable
            required
        />
        {selectedCountry && regions.length > 0 && (
            <div className="mb-4">
            <label htmlFor="region" className="block mb-2 font-semibold">Select your state/region</label>
            <Select
                id="region"
                name="region"
                className="text-black text-sm sm:text-base"
                classNamePrefix="react-select"
                options={regions}
                value={selectedZone ? regions.find(r => regionTimeZones[selectedCountry.id][r.value] === selectedZone) : null}
                onChange={(option: any) => {
                setSelectedZone(regionTimeZones[selectedCountry.id][option.value]);
                }}
                placeholder="Select your state/region"
                isSearchable
                required
            />
            </div>
        )}
        {selectedCountry && !regions.length && zones.length > 0 && (
            <div className="mb-4">
            <label htmlFor="timezone" className="block mb-2 font-semibold">Select your city/timezone</label>
            <Select
                id="timezone"
                name="timezone"
                className="text-black text-sm sm:text-base"
                classNamePrefix="react-select"
                options={zones}
                value={selectedZone ? zones.find((z: ZoneOption) => z.value === selectedZone) : null}
                onChange={(option: any) => setSelectedZone(option.value)}
                placeholder="Select your city/timezone"
                isSearchable
                required
            />
            </div>
        )}
        {selectedZone && (
            <div 
              className="text-lg font-bold text-gray-800 bg-green-200 rounded-sm text-center p-2 cursor-pointer hover:bg-green-300 transition-colors duration-200 border-2 border-transparent hover:border-green-400"
              onClick={() => setIsModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsModalOpen(true);
                }
              }}
            >
              Bible Study Time: {getLocalTimeForZone({ baseZone: CST_ZONE, baseTime: CST_TIME, targetZone: selectedZone })} ({DateTime.now().setZone(selectedZone).offsetNameShort})
              <div className="text-sm mt-1 text-green-800">
                📝 Click here to register for Bible Study
              </div>
            </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 cursor-pointer right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Form */}
              <BibleStudyForm />
            </div>
          </div>
        )}

        </div>
        <div className="text-center mt-8">
            <h4 className="text-lg font-bold text-gray-800">Other Locations</h4>
        
        <ul className="text-gray-800 text-sm md:text-lg mb-6 space-y-1">
            {locations.map((loc: { label: string; zone: string }) => {
              const zoneAbbr = DateTime.now().setZone(loc.zone).offsetNameShort;
              // Map country label to country code for flag
              const countryCodeMap: Record<string, string> = {
                "United States (Chicago)": "US",
                "United States (New York)": "US",
                "United Kingdom": "GB",
                "Nigeria": "NG",
                "UAE": "AE",
              };
              const flag = getFlag(countryCodeMap[loc.label] || "");
              return (
                <li className="text-gray-800 text-base leading-6" key={loc.label}>
                  <span style={{ marginRight: "0.5em" }}>{flag}</span>
                  {loc.label} - {getLocalTimeForZone({ baseZone: CST_ZONE, baseTime: CST_TIME, targetZone: loc.zone })} ({zoneAbbr})
                </li>
              );
            })}
        </ul>
        </div>
        
    </div>
  );
}
