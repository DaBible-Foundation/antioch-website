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

const DEFAULT_CRM_TIMEOUT_MS = 8000;
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

export async function syncBibleStudyRegistrationToCrm(
  input: BibleStudyRegistrationInput,
  payment: BibleStudyCrmPayment
): Promise<CrmSyncResult> {
  const endpoint = process.env.DABIBLE_CRM_REGISTRATION_ENDPOINT;
  if (!endpoint) {
    return { status: "skipped", message: "DABIBLE_CRM_REGISTRATION_ENDPOINT is not configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    getEnvNumber(process.env.DABIBLE_CRM_TIMEOUT_MS, DEFAULT_CRM_TIMEOUT_MS)
  );

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (process.env.DABIBLE_CRM_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.DABIBLE_CRM_API_TOKEN}`;
    }

    const payload = buildCrmPayload(input, payment);
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error("CRM registration sync failed", {
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
    const message = error instanceof Error ? error.message : "Unknown CRM sync error";
    console.error("CRM registration sync error", error);
    return { status: "failed", message };
  } finally {
    clearTimeout(timeout);
  }
}
