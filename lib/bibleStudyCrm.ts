import crypto from "crypto";

export type BibleStudyRegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  countryCode?: string;
  dialCode?: string;
  phone: string;
  address: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  ageGroup: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  parentSignature?: string;
  parentConsentAccepted?: boolean;
  knowsAntioch?: string;
  contactPreference: string;
  otherContactDetail?: string;
};

type PaymentStatus = "free" | "checkout_created" | "paid" | "payment_failed";

export type BibleStudyCrmPayment = {
  required: boolean;
  status: PaymentStatus;
  amountCents: number;
  currency: string;
  provider?: "stripe";
  checkoutSessionId?: string | null;
  checkoutUrl?: string | null;
};

type CrmSyncResult = {
  status: "skipped" | "sent" | "failed";
  statusCode?: number;
  message?: string;
};

type RegistrationSyncResult = {
  crmStatus: CrmSyncResult;
  googleSheetsStatus: CrmSyncResult;
};

const DEFAULT_CRM_TIMEOUT_MS = 8000;
const DEFAULT_GOOGLE_SHEETS_TIMEOUT_MS = 8000;
const TEEN_AGE_GROUP = "Teens (ages 12-15)";

function getEnvNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getAgeGroupSlug(ageGroup: string) {
  if (ageGroup === TEEN_AGE_GROUP) return "teens";
  if (ageGroup === "Young Adults (ages 16-18)") return "young-adults";
  if (ageGroup === "Adults (18 years and older)") return "adults";
  return "";
}

function getIdempotencyKey(input: BibleStudyRegistrationInput, payment: BibleStudyCrmPayment) {
  const rawKey = [
    "antioch-bible-study",
    input.firstName.trim().toLowerCase(),
    input.lastName.trim().toLowerCase(),
    input.email.trim().toLowerCase(),
    input.phone.trim(),
    getAgeGroupSlug(input.ageGroup),
    payment.checkoutSessionId || payment.status,
  ].join("|");

  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

function buildCrmPayload(input: BibleStudyRegistrationInput, payment: BibleStudyCrmPayment) {
  const submittedAt = new Date().toISOString();
  const isTeen = input.ageGroup === TEEN_AGE_GROUP;

  return {
    source: {
      app: "welcome-to-antioch",
      domain: "welcometoantioch.com",
      form: "antioch-bible-study-registration",
      submittedAt,
    },
    idempotencyKey: getIdempotencyKey(input, payment),
    participant: {
      firstName: input.firstName,
      lastName: input.lastName,
      name: `${input.firstName} ${input.lastName}`.trim(),
      email: input.email,
      phone: input.phone,
      country: input.country,
      countryCode: input.countryCode || "",
      dialCode: input.dialCode || "",
      address: {
        line1: input.streetAddress || input.address,
        city: input.city || "",
        state: input.state || "",
        postalCode: input.zipCode || "",
        formatted: input.address,
      },
    },
    registration: {
      program: "Antioch Bible Study",
      session: "2026 Summer Bible Study",
      theme: "Fear of God",
      ageGroup: input.ageGroup,
      ageGroupSlug: getAgeGroupSlug(input.ageGroup),
      isTeen,
      knowsAntiochOrDaBibleFoundation: input.knowsAntioch === "yes",
      preferredContactMethod: input.contactPreference,
      otherContactDetail: input.otherContactDetail || "",
    },
    guardian: isTeen
      ? {
          firstName: input.guardianFirstName || "",
          lastName: input.guardianLastName || "",
          name: `${input.guardianFirstName || ""} ${input.guardianLastName || ""}`.trim(),
          phone: input.guardianPhone || "",
          email: input.guardianEmail || "",
        }
      : null,
    consent: isTeen
      ? {
          accepted: Boolean(input.parentConsentAccepted),
          signatureDataUrl: input.parentSignature || "",
        }
      : null,
    payment,
  };
}

function buildGoogleSheetsPayload(input: BibleStudyRegistrationInput, payment: BibleStudyCrmPayment) {
  const isTeen = input.ageGroup === TEEN_AGE_GROUP;

  return {
    token: process.env.GOOGLE_SHEETS_REGISTRATION_WEBHOOK_TOKEN || "",
    submittedAt: new Date().toISOString(),
    firstName: input.firstName,
    lastName: input.lastName,
    name: `${input.firstName} ${input.lastName}`.trim(),
    email: input.email,
    phone: input.phone,
    country: input.country,
    countryCode: input.countryCode || "",
    dialCode: input.dialCode || "",
    streetAddress: input.streetAddress || "",
    city: input.city || "",
    state: input.state || "",
    zipCode: input.zipCode || "",
    formattedAddress: input.address,
    ageGroup: input.ageGroup,
    ageGroupSlug: getAgeGroupSlug(input.ageGroup),
    isTeen,
    knowsAntiochOrDaBibleFoundation: input.knowsAntioch === "yes" ? "Yes" : "No",
    contactPreference: input.contactPreference,
    otherContactDetail: input.otherContactDetail || "",
    guardianFirstName: isTeen ? input.guardianFirstName || "" : "",
    guardianLastName: isTeen ? input.guardianLastName || "" : "",
    guardianName: isTeen ? `${input.guardianFirstName || ""} ${input.guardianLastName || ""}`.trim() : "",
    guardianPhone: isTeen ? input.guardianPhone || "" : "",
    guardianEmail: isTeen ? input.guardianEmail || "" : "",
    parentConsentAccepted: isTeen && input.parentConsentAccepted ? "Yes" : isTeen ? "No" : "",
    parentSignatureCaptured: isTeen && input.parentSignature ? "Yes" : isTeen ? "No" : "",
    paymentRequired: payment.required ? "Yes" : "No",
    paymentStatus: payment.status,
    paymentAmount: (payment.amountCents / 100).toFixed(2),
    paymentCurrency: payment.currency.toUpperCase(),
    paymentProvider: payment.provider || "",
    checkoutSessionId: payment.checkoutSessionId || "",
    checkoutUrl: payment.checkoutUrl || "",
    idempotencyKey: getIdempotencyKey(input, payment),
  };
}

async function postJsonWithTimeout({
  endpoint,
  headers,
  payload,
  timeoutMs,
  failureLabel,
}: {
  endpoint: string;
  headers: Record<string, string>;
  payload: Record<string, unknown>;
  timeoutMs: number;
  failureLabel: string;
}): Promise<CrmSyncResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error(`${failureLabel} failed`, {
        status: response.status,
        body: responseText.slice(0, 500),
      });

      return {
        status: "failed",
        statusCode: response.status,
        message: responseText || response.statusText,
      };
    }

    return { status: "sent", statusCode: response.status };
  } catch (error) {
    const message = error instanceof Error ? error.message : `Unknown ${failureLabel} error`;
    console.error(`${failureLabel} error`, error);
    return { status: "failed", message };
  } finally {
    clearTimeout(timeout);
  }
}

export async function syncBibleStudyRegistrationToCrm(
  input: BibleStudyRegistrationInput,
  payment: BibleStudyCrmPayment
): Promise<CrmSyncResult> {
  const endpoint = process.env.DABIBLE_CRM_REGISTRATION_ENDPOINT;
  if (!endpoint) {
    return { status: "skipped", message: "DABIBLE_CRM_REGISTRATION_ENDPOINT is not configured" };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (process.env.DABIBLE_CRM_API_TOKEN) {
    headers.Authorization = `Bearer ${process.env.DABIBLE_CRM_API_TOKEN}`;
  }

  return postJsonWithTimeout({
    endpoint,
    headers,
    payload: buildCrmPayload(input, payment),
    timeoutMs: getEnvNumber(process.env.DABIBLE_CRM_TIMEOUT_MS, DEFAULT_CRM_TIMEOUT_MS),
    failureLabel: "CRM registration sync",
  });
}

export async function syncBibleStudyRegistrationToGoogleSheets(
  input: BibleStudyRegistrationInput,
  payment: BibleStudyCrmPayment
): Promise<CrmSyncResult> {
  const endpoint = process.env.GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL;
  if (!endpoint) {
    return { status: "skipped", message: "GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL is not configured" };
  }

  return postJsonWithTimeout({
    endpoint,
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      Accept: "application/json",
    },
    payload: buildGoogleSheetsPayload(input, payment),
    timeoutMs: getEnvNumber(process.env.GOOGLE_SHEETS_TIMEOUT_MS, DEFAULT_GOOGLE_SHEETS_TIMEOUT_MS),
    failureLabel: "Google Sheets registration sync",
  });
}

export async function syncBibleStudyRegistration(
  input: BibleStudyRegistrationInput,
  payment: BibleStudyCrmPayment
): Promise<RegistrationSyncResult> {
  const [crmStatus, googleSheetsStatus] = await Promise.all([
    syncBibleStudyRegistrationToCrm(input, payment),
    syncBibleStudyRegistrationToGoogleSheets(input, payment),
  ]);

  return { crmStatus, googleSheetsStatus };
}
