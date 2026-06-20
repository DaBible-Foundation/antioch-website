import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { syncBibleStudyRegistrationToCrm } from '@/lib/bibleStudyCrm';

export const runtime = 'nodejs';

const TEEN_AGE_GROUP = 'Teens (ages 12-15)';
const TEEN_REGISTRATION_FEE_CENTS = 5000;

function normalizeName(name: string) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
}

function getAgeGroupParam(ageGroup: string) {
  if (ageGroup === 'Teens (ages 12-15)') return 'teens';
  if (ageGroup === 'Young Adults (ages 16-18)') return 'young-adults';
  if (ageGroup === 'Adults (18 years and older)') return 'adults';
  return '';
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
    recaptchaToken
  } = body;

  const firstName = normalizeName(body.firstName);
  const lastName = normalizeName(body.lastName);

  const missing: string[] = [];
  if (!firstName) missing.push('First Name');
  if (!lastName) missing.push('Last Name');
  if (!email) missing.push('Email');
  if (!country) missing.push('Country');
  if (!phone) missing.push('Phone');
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
    success_url: `${origin}/congratulations?${successParams.toString()}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/register`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: TEEN_REGISTRATION_FEE_CENTS,
          product_data: {
            name: 'Antioch Bible Study Teen Registration',
            description: 'Teen registration fee for Antioch Bible Study',
          },
        },
      },
    ],
    metadata: {
      registrationType: 'bible-study',
      firstName,
      lastName,
      email,
      country,
      countryCode: countryCode || '',
      dialCode: dialCode || '',
      phone,
      address,
      streetAddress: streetAddress || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      ageGroup,
      guardianFirstName,
      guardianLastName,
      guardianPhone,
      guardianEmail,
      parentSignatureCaptured: parentSignature ? 'true' : 'false',
      parentConsentAccepted: parentConsentAccepted ? 'true' : 'false',
      knowsAntioch,
      contactPreference,
      otherContactDetail: otherContactDetail || '',
    },
  });

  const crmStatus = await syncBibleStudyRegistrationToCrm(
    {
      firstName,
      lastName,
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
  );

  return NextResponse.json({ checkoutUrl: session.url, crmStatus });
}
