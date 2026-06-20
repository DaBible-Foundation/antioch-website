import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { syncBibleStudyRegistration } from '@/lib/bibleStudyCrm';

export const runtime = 'nodejs';

const TEEN_AGE_GROUP = 'Teens (ages 12-15)';
const TEEN_REGISTRATION_FEE_CENTS = 5000;
const TEEN_REGISTRATION_PRODUCT_ID = process.env.STRIPE_TEEN_REGISTRATION_PRODUCT_ID || 'prod_UjwAvbdAbdEcwp';
const MAX_TEEN_PARTICIPANTS = 5;

type Participant = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

type CheckoutRequestBody = Record<string, unknown>;

function normalizeName(name: string) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
}

function getAgeGroupParam(ageGroup: string) {
  if (ageGroup === 'Teens (ages 12-15)') return 'teens';
  if (ageGroup === 'Young Adults (ages 16-18)') return 'young-adults';
  if (ageGroup === 'Adults (18 years and older)') return 'adults';
  return '';
}

function getStringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getParticipants(body: CheckoutRequestBody): Participant[] {
  if (Array.isArray(body.participants)) {
    return body.participants
      .slice(0, MAX_TEEN_PARTICIPANTS)
      .map((participant) => {
        const participantRecord = participant && typeof participant === 'object'
          ? participant as Record<string, unknown>
          : {};

        return {
          firstName: normalizeName(getStringValue(participantRecord.firstName)),
          lastName: normalizeName(getStringValue(participantRecord.lastName)),
          email: getStringValue(participantRecord.email) || getStringValue(body.guardianEmail) || getStringValue(body.email),
          phone: getStringValue(participantRecord.phone) || getStringValue(body.guardianPhone) || getStringValue(body.phone),
        };
      })
      .filter((participant: Participant) => participant.firstName && participant.lastName);
  }

  const firstName = normalizeName(getStringValue(body.firstName));
  const lastName = normalizeName(getStringValue(body.lastName));
  return firstName && lastName
    ? [{
        firstName,
        lastName,
        email: getStringValue(body.email) || getStringValue(body.guardianEmail),
        phone: getStringValue(body.phone) || getStringValue(body.guardianPhone),
      }]
    : [];
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    email,
    country,
    countryCode,
    dialCode,
    phone,
    address,
    streetAddress,
    city,
    state,
    zipCode,
    ageGroup,
    guardianFirstName,
    guardianLastName,
    guardianPhone,
    guardianEmail,
    parentSignature,
    parentConsentAccepted,
    knowsAntioch,
    contactPreference,
    otherContactDetail,
    discountCode,
    recaptchaToken
  } = body;

  const participants = getParticipants(body);
  const primaryParticipant = participants[0];
  const firstName = primaryParticipant?.firstName || '';
  const lastName = primaryParticipant?.lastName || '';
  const participantCount = participants.length;

  const missing: string[] = [];
  if (!participantCount) missing.push('At least one child');
  if (!country) missing.push('Country');
  if (!address) missing.push('Address');
  if (ageGroup !== TEEN_AGE_GROUP) missing.push('Teen Age Group');
  if (countryCode !== 'US') missing.push('United States country selection');
  if (!guardianFirstName) missing.push('Parent/Guardian First Name');
  if (!guardianLastName) missing.push('Parent/Guardian Last Name');
  if (!guardianPhone) missing.push('Parent/Guardian Phone');
  if (!guardianEmail) missing.push('Parent/Guardian Email');
  if (!parentSignature) missing.push('Parent/Guardian Signature');
  if (!parentConsentAccepted) missing.push('Parent/Guardian Consent');
  if (!knowsAntioch) missing.push('Antioch or DaBible Foundation Familiarity');
  if (!contactPreference) missing.push('Preferred Contact Method');
  if (contactPreference === 'Other' && !otherContactDetail) missing.push('Other Contact Detail');
  if (!recaptchaToken) missing.push('reCAPTCHA');

  if (missing.length) {
    return NextResponse.json({ error: 'Missing fields', missing }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.basil',
  });

  const normalizedDiscountCode = typeof discountCode === 'string' ? discountCode.trim() : '';
  let promotionCodeId: string | undefined;

  if (normalizedDiscountCode) {
    const promotionCodes = await stripe.promotionCodes.list({
      code: normalizedDiscountCode,
      active: true,
      limit: 1,
    });

    promotionCodeId = promotionCodes.data[0]?.id;
    const coupon = promotionCodes.data[0]?.coupon;
    const allowedProducts = coupon?.applies_to?.products || [];

    if (!promotionCodeId || !coupon?.valid) {
      return NextResponse.json(
        { error: 'This discount code is not valid or is no longer active.' },
        { status: 400 }
      );
    }

    if (allowedProducts.length && !allowedProducts.includes(TEEN_REGISTRATION_PRODUCT_ID)) {
      return NextResponse.json(
        { error: 'This discount code cannot be applied to this registration.' },
        { status: 400 }
      );
    }
  }

  const origin = req.nextUrl.origin;
  const successParams = new URLSearchParams({
    registration: 'teen',
    payment: 'success',
    ageGroup: getAgeGroupParam(ageGroup),
    knowsAntioch,
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    allow_promotion_codes: promotionCodeId ? undefined : true,
    discounts: promotionCodeId ? [{ promotion_code: promotionCodeId }] : undefined,
    success_url: `${origin}/congratulations?${successParams.toString()}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/register`,
    line_items: [
      {
        quantity: participantCount,
        price_data: {
          currency: 'usd',
          unit_amount: TEEN_REGISTRATION_FEE_CENTS,
          product: TEEN_REGISTRATION_PRODUCT_ID,
        },
      },
    ],
    metadata: {
      registrationType: 'bible-study',
      firstName,
      lastName,
      email: guardianEmail || email || '',
      country,
      countryCode: countryCode || '',
      dialCode: dialCode || '',
      phone: guardianPhone || phone || '',
      address,
      streetAddress: streetAddress || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      ageGroup,
      participantCount: String(participantCount),
      participantNames: participants.map((participant) => `${participant.firstName} ${participant.lastName}`).join(', '),
      guardianFirstName,
      guardianLastName,
      guardianPhone,
      guardianEmail,
      parentSignatureCaptured: parentSignature ? 'true' : 'false',
      parentConsentAccepted: parentConsentAccepted ? 'true' : 'false',
      knowsAntioch,
      contactPreference,
      otherContactDetail: otherContactDetail || '',
      discountCode: normalizedDiscountCode,
    },
  });

  const syncStatuses = await Promise.all(participants.map((participant) => (
    syncBibleStudyRegistration(
      {
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: guardianEmail || participant.email || email || '',
        country,
        countryCode,
        dialCode,
        phone: guardianPhone || participant.phone || phone || '',
        address,
        streetAddress,
        city,
        state,
        zipCode,
        ageGroup,
        guardianFirstName,
        guardianLastName,
        guardianPhone,
        guardianEmail,
        parentSignature,
        parentConsentAccepted,
        knowsAntioch,
        contactPreference,
        otherContactDetail,
      },
      {
        required: true,
        status: 'checkout_created',
        amountCents: TEEN_REGISTRATION_FEE_CENTS,
        currency: 'usd',
        provider: 'stripe',
        checkoutSessionId: session.id,
        checkoutUrl: session.url,
      }
    )
  )));

  const crmStatus = syncStatuses.every((status) => status.crmStatus.status === 'sent' || status.crmStatus.status === 'skipped')
    ? syncStatuses[0]?.crmStatus || { status: 'skipped' as const }
    : { status: 'failed' as const, message: 'One or more child CRM syncs did not complete' };
  const googleSheetsStatus = syncStatuses.every((status) => status.googleSheetsStatus.status === 'sent' || status.googleSheetsStatus.status === 'skipped')
    ? syncStatuses[0]?.googleSheetsStatus || { status: 'skipped' as const }
    : { status: 'failed' as const, message: 'One or more child Google Sheets syncs did not complete' };

  return NextResponse.json({ checkoutUrl: session.url, crmStatus, googleSheetsStatus, participantCount });
}
