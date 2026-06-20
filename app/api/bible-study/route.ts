/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { emailTemplate } from '@/components/EmailTemplate';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { syncBibleStudyRegistration } from '@/lib/bibleStudyCrm';

export const runtime = "nodejs";

// Feature toggles (env)
const ENABLE_EMAILS = process.env.ENABLE_BIBLE_STUDY_EMAILS !== 'false';
const ENABLE_SMS = process.env.ENABLE_BIBLE_STUDY_SMS === 'true';

// ---- Helpers ----
type ListItem = { label: string; value: string };
type Participant = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

const TEEN_AGE_GROUP = 'Teens (ages 12-15)';
const YOUNG_ADULT_AGE_GROUP = 'Young Adults (ages 16-18)';
const ADULT_AGE_GROUP = 'Adults (18 years and older)';
const ONBOARDING_WHATSAPP_URL = 'https://chat.whatsapp.com/FGA9UkTb1mY0MnFGCgHTGc?s=cl&p=i&ilr=4';
const TEENS_WHATSAPP_URL = 'https://chat.whatsapp.com/Cv7HVeyEKPQ2Le61HSR3V8?s=cl&p=i&ilr=4';
const YOUNG_ADULTS_WHATSAPP_URL = 'https://chat.whatsapp.com/FmeLlLWIwgZ0H1lw58vECR?s=cl&p=i&ilr=4';
const ADULTS_WHATSAPP_URL = 'https://chat.whatsapp.com/FmeLlLWIwgZ0H1lw58vECR?s=cl&p=i&ilr=4';
const MAX_TEEN_PARTICIPANTS = 5;

function normalizeName(name: string) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
}

function getStringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getParticipants(body: Record<string, unknown>): Participant[] {
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

function getWhatsAppGroupUrl(ageGroup: string, knowsAntioch?: string) {
  if (knowsAntioch !== 'yes') return ONBOARDING_WHATSAPP_URL;
  if (ageGroup === TEEN_AGE_GROUP) return TEENS_WHATSAPP_URL;
  if (ageGroup === YOUNG_ADULT_AGE_GROUP) return YOUNG_ADULTS_WHATSAPP_URL;
  if (ageGroup === ADULT_AGE_GROUP) return ADULTS_WHATSAPP_URL;
  return ONBOARDING_WHATSAPP_URL;
}

function buildListItems(data: {
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
}): ListItem[] {
  const isPaidTeenRegistration = data.ageGroup === TEEN_AGE_GROUP && data.country === 'United States of America';
  const items: ListItem[] = [
    { label: 'First Name', value: data.firstName },
    { label: 'Last Name', value: data.lastName },
    { label: 'Email', value: data.email },
    { label: 'Country', value: data.country },
    { label: 'Phone', value: data.phone },
    { label: 'Address', value: data.address },
    { label: 'Age Group', value: data.ageGroup },
    { label: 'Already Familiar with Antioch or DaBible Foundation', value: data.knowsAntioch === 'yes' ? 'Yes' : 'No' },
    { label: 'Preferred Contact Method', value: data.contactPreference },
  ];
  if (data.ageGroup === TEEN_AGE_GROUP) {
    items.push(
      { label: 'Parent/Guardian First Name', value: data.guardianFirstName || '' },
      { label: 'Parent/Guardian Last Name', value: data.guardianLastName || '' },
      { label: 'Parent/Guardian Phone', value: data.guardianPhone || '' },
      { label: 'Parent/Guardian Email', value: data.guardianEmail || '' },
      { label: 'Parent/Guardian Signature', value: data.parentSignature ? 'Captured' : '' },
      { label: 'Parent/Guardian Consent', value: data.parentConsentAccepted ? 'Accepted' : 'Not accepted' },
      { label: 'Registration Fee', value: isPaidTeenRegistration ? '$50' : 'Free' },
    );
  } else {
    items.push({ label: 'Registration Fee', value: 'Free' });
  }
  if (data.contactPreference === 'Other' && data.otherContactDetail) {
    items.push({ label: 'Other Contact Detail', value: data.otherContactDetail });
  }
  return items;
}

function getTransporter() {
  if (!process.env.DABIBLE_GMAIL_ADDRESS || !process.env.DABIBLE_GMAIL_PASSWORD) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.DABIBLE_GMAIL_ADDRESS,
      pass: process.env.DABIBLE_GMAIL_PASSWORD,
    },
  });
}

// ---- Email Senders ----
async function sendAdminEmail(
  transporter: nodemailer.Transporter,
  listItems: ListItem[],
  firstName: string,
  lastName: string,
  email: string,
  phone: string
) {
  if (!process.env.DABIBLE_ADMIN_EMAIL) return 'skipped';
  try {
    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${process.env.DABIBLE_GMAIL_ADDRESS}>`,
      to: process.env.DABIBLE_ADMIN_EMAIL,
      subject: `Bible Study Request from ${firstName} ${lastName}`,
      html: emailTemplate({
        firstName,
        lastName,
        title: 'New Antioch Bible Study Request',
        listItems,
        paragraph1: `A new request has been made for the Antioch Bible Study program. Please review the details below.`,
        paragraph2: `You can contact the user directly at ${email} or via phone at ${phone}.`,
        paragraph4: `Thank you for your attention to this request.`,
      }),
    });
    return 'sent';
  } catch (e) {
    console.error('Admin email failed', e);
    return 'failed';
  }
}

async function sendUserEmail(
  transporter: nodemailer.Transporter,
  listItems: ListItem[],
  firstName: string,
  lastName: string,
  email: string
) {
  const ageGroup = listItems.find((item) => item.label === 'Age Group')?.value || '';
  const knowsAntioch = listItems.find((item) => item.label === 'Already Familiar with Antioch or DaBible Foundation')?.value === 'Yes' ? 'yes' : 'no';
  const whatsappGroupUrl = getWhatsAppGroupUrl(ageGroup, knowsAntioch);
  const isOnboardingGroup = whatsappGroupUrl === ONBOARDING_WHATSAPP_URL;

  try {
    await transporter.sendMail({
      from: `"DaBible Foundation" <${process.env.DABIBLE_GMAIL_ADDRESS}>`,
      to: email,
      subject: 'Thanks for showing interest in Antioch Bible Study',
      html: emailTemplate({
        firstName,
        lastName,
        title: 'Thank You for Your Interest in Antioch Bible Study',
        listItems,
        paragraph1: `We're thrilled to welcome you to the Antioch Bible Study family. You've just taken the first step toward a deeper, more vibrant walk with God, and you're not doing it alone.`,
        heading1: 'What Happens Next?',
        paragraph2: isOnboardingGroup
          ? "To get started, please click the button below to join our onboarding WhatsApp group. This is where you'll receive next steps, meet fellow participants, and get all the details about our bible study."
          : "Please click the button below to join the WhatsApp group for your Bible Study age group.",
        ctaButtons: [
          {
            label: 'Join WhatsApp Group',
            url: whatsappGroupUrl,
          }
        ],
        paragraph3: isOnboardingGroup
          ? `We host regular onboarding sessions to help you understand our mission, structure, and what to expect during our weekly studies.`
          : `We are glad to have you continue with the Antioch Bible Study community.`,
        heading2: 'Your Registration Summary',
        paragraph4: `We can't wait to connect with you. Your spiritual growth matters to us, and we're honored to walk alongside you.`,
      }),
    });
    return 'sent';
  } catch (e) {
    console.error('User email failed', e);
    return 'failed';
  }
}

// ---- SMS (Twilio SDK) ----
async function sendWelcomeSMS(firstName: string, phone: string, countryCode: string) {
  console.log('🔍 [SMS DEBUG] Starting sendWelcomeSMS function');
  console.log('🔍 [SMS DEBUG] Parameters:', { firstName, phone, countryCode });
  console.log('🔍 [SMS DEBUG] ENABLE_SMS flag:', ENABLE_SMS);
  
  if (!ENABLE_SMS) {
    console.log('❌ [SMS DEBUG] SMS disabled via ENABLE_SMS flag');
    return 'skipped';
  }
  
  // Only send SMS to USA users
  if (countryCode !== 'US') {  // ✅ CHECKS US COUNTRY
    console.log(`❌ [SMS DEBUG] SMS skipped: User from ${countryCode}, not US`);
    return 'skipped';
  }
  console.log('✅ [SMS DEBUG] Country check passed - user is from US');
  
  // Check environment variables
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER;
  
  console.log('🔍 [SMS DEBUG] Twilio env vars check:');
  console.log('  - TWILIO_ACCOUNT_SID:', twilioSid ? `Present (${twilioSid.substring(0, 10)}...)` : 'MISSING');
  console.log('  - TWILIO_AUTH_TOKEN:', twilioToken ? `Present (${twilioToken.substring(0, 10)}...)` : 'MISSING');
  console.log('  - TWILIO_FROM_NUMBER:', twilioFrom ? twilioFrom : 'MISSING');
  
  if (!twilioSid || !twilioToken || !twilioFrom) {
    console.error('❌ [SMS DEBUG] Twilio env vars missing - SMS cannot be sent');
    return 'skipped';
  }
  console.log('✅ [SMS DEBUG] All Twilio env vars present');
  
  // Check phone format
  console.log('🔍 [SMS DEBUG] Phone format check:', phone, 'starts with +?', phone.startsWith('+'));
  if (!phone.startsWith('+')) {
    console.error('❌ [SMS DEBUG] Phone not in E.164 format, skipping SMS');
    return 'failed';
  }
  console.log('✅ [SMS DEBUG] Phone format check passed');
  
  try {
    console.log('🚀 [SMS DEBUG] Starting Twilio SDK call...');
    
    // Initialize Twilio client
    const client = twilio(twilioSid, twilioToken);
    
    const message = `Hi ${firstName}, welcome to the Antioch Bible Study! We're excited to have you join us.`;
    console.log('🔍 [SMS DEBUG] Message content:', message);
    
    console.log('📡 [SMS DEBUG] Sending SMS via Twilio SDK...');
    
    // Send SMS using SDK
    const messageResponse = await client.messages.create({
      body: message,
      from: twilioFrom,
      to: phone.trim()
    });

    console.log('✅ [SMS DEBUG] Twilio SMS sent successfully!');
    console.log('✅ [SMS DEBUG] Message SID:', messageResponse.sid);
    console.log('✅ [SMS DEBUG] Message Status:', messageResponse.status);
    console.log('✅ [SMS DEBUG] Message Direction:', messageResponse.direction);
    
    return 'sent';
  } catch (e: any) {
    console.error('❌ [SMS DEBUG] Twilio SDK exception occurred:', e);
    console.error('❌ [SMS DEBUG] Exception details:', {
      name: e.name,
      message: e.message,
      code: e.code,
      moreInfo: e.moreInfo,
      status: e.status
    });
    return 'failed';
  }
}

// ---- Handler ----
export async function POST(req: NextRequest) {
  console.log('🔥 [API DEBUG] Bible Study API called');
  
  const body = await req.json() as any;
  console.log('🔥 [API DEBUG] Request body received:', body);
  
  let {
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
    recaptchaToken
  } = body;

  const participants = getParticipants(body);
  const isTeenRegistration = ageGroup === TEEN_AGE_GROUP;
  const primaryParticipant = participants[0];

  firstName = isTeenRegistration ? primaryParticipant?.firstName || '' : normalizeName(firstName);
  lastName = isTeenRegistration ? primaryParticipant?.lastName || '' : normalizeName(lastName);
  email = isTeenRegistration ? guardianEmail || email : email;
  phone = isTeenRegistration ? guardianPhone || phone : phone;

  console.log('🔥 [API DEBUG] Normalized names:', { firstName, lastName });
  console.log('🔥 [API DEBUG] Contact preference:', contactPreference);
  console.log('🔥 [API DEBUG] Country code:', countryCode);

  const missing: string[] = [];
  if (isTeenRegistration) {
    if (!participants.length) missing.push('At least one child');
  } else {
    if (!firstName) missing.push('First Name');
    if (!lastName) missing.push('Last Name');
    if (!email) missing.push('Email');
    if (!phone) missing.push('Phone');
  }
  if (!country) missing.push('Country');
  if (!address) missing.push('Address');
  if (!ageGroup) missing.push('Age Group');
  if (!knowsAntioch) missing.push('Antioch or DaBible Foundation Familiarity');
  if (isTeenRegistration) {
    if (!guardianFirstName) missing.push('Parent/Guardian First Name');
    if (!guardianLastName) missing.push('Parent/Guardian Last Name');
    if (!guardianPhone) missing.push('Parent/Guardian Phone');
    if (!guardianEmail) missing.push('Parent/Guardian Email');
    if (!parentSignature) missing.push('Parent/Guardian Signature');
    if (!parentConsentAccepted) missing.push('Parent/Guardian Consent');
  }
  if (!contactPreference) missing.push('Preferred Contact Method');
  if (contactPreference === 'Other' && !otherContactDetail) missing.push('Other Contact Detail');
  if (!recaptchaToken) missing.push('reCAPTCHA');

  if (missing.length) {
    console.error('❌ [API DEBUG] Missing fields:', missing);
    return NextResponse.json({ error: 'Missing fields', missing }, { status: 400 });
  }
  console.log('✅ [API DEBUG] All required fields present');

  try {
    const listItems = buildListItems({
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
      otherContactDetail
    });

    const syncParticipants = isTeenRegistration
      ? participants
      : [{ firstName, lastName, email, phone }];

    const syncStatuses = await Promise.all(syncParticipants.map((participant) => (
      syncBibleStudyRegistration(
        {
          firstName: participant.firstName,
          lastName: participant.lastName,
          email: participant.email || email,
          country,
          countryCode,
          dialCode,
          phone: participant.phone || phone,
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
          required: false,
          status: 'free',
          amountCents: 0,
          currency: 'usd',
        }
      )
    )));

    const crmStatus = syncStatuses.every((status) => status.crmStatus.status === 'sent' || status.crmStatus.status === 'skipped')
      ? syncStatuses[0]?.crmStatus || { status: 'skipped' as const }
      : { status: 'failed' as const, message: 'One or more participant CRM syncs did not complete' };
    const googleSheetsStatus = syncStatuses.every((status) => status.googleSheetsStatus.status === 'sent' || status.googleSheetsStatus.status === 'skipped')
      ? syncStatuses[0]?.googleSheetsStatus || { status: 'skipped' as const }
      : { status: 'failed' as const, message: 'One or more participant Google Sheets syncs did not complete' };

    // Email statuses
    let adminEmailStatus: 'skipped' | 'sent' | 'failed' = 'skipped';
    let userEmailStatus: 'skipped' | 'sent' | 'failed' = 'skipped';

    console.log('📧 [API DEBUG] ENABLE_EMAILS:', ENABLE_EMAILS);
    if (ENABLE_EMAILS) {
      const transporter = getTransporter();
      if (!transporter) {
        console.warn('⚠️ [API DEBUG] Email transporter unavailable');
      } else {
        console.log('📧 [API DEBUG] Sending emails...');
        adminEmailStatus = await sendAdminEmail(transporter, listItems, firstName, lastName, email, phone);
        userEmailStatus = await sendUserEmail(transporter, listItems, firstName, lastName, email);
        console.log('📧 [API DEBUG] Email statuses:', { adminEmailStatus, userEmailStatus });
      }
    }

    // Conditional SMS (only if preference === SMS AND country === US)
    let smsStatus: 'skipped' | 'sent' | 'failed' = 'skipped';
    console.log('📱 [API DEBUG] Checking SMS conditions...');
    console.log('📱 [API DEBUG] Contact preference === SMS?', contactPreference === 'SMS');
    
    if (contactPreference === 'SMS') {  // ✅ CHECKS SMS PREFERENCE
      console.log('📱 [API DEBUG] SMS preference selected, calling sendWelcomeSMS...');
      smsStatus = await sendWelcomeSMS(firstName, phone, countryCode);
      console.log('📱 [API DEBUG] SMS function returned:', smsStatus);
    } else {
      console.log('📱 [API DEBUG] SMS not selected as contact preference, skipping');
    }

    const response = {
      success: true,
      adminEmailStatus,
      userEmailStatus,
      smsStatus,
      crmStatus,
      googleSheetsStatus,
      featureFlags: {
        emails: ENABLE_EMAILS,
        sms: ENABLE_SMS
      }
    };

    console.log('✅ [API DEBUG] Final response:', response);
    return NextResponse.json(response);
  } catch (e: any) {
    console.error('❌ [API DEBUG] API error occurred:', e);
    console.error('❌ [API DEBUG] Error details:', {
      name: e.name,
      message: e.message,
      stack: e.stack
    });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
