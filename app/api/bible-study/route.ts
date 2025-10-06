/* eslint-disable prefer-const */
import { emailTemplate } from '@/components/EmailTemplate';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = "nodejs";

// Feature toggles (env)
const ENABLE_EMAILS = process.env.ENABLE_BIBLE_STUDY_EMAILS !== 'false';
const ENABLE_SMS = process.env.ENABLE_BIBLE_STUDY_SMS === 'true';

// ---- Helpers ----
type ListItem = { label: string; value: string };

function normalizeName(name: string) {
  return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
}

function buildListItems(data: {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  contactPreference: string;
  otherContactDetail?: string;
}): ListItem[] {
  const items: ListItem[] = [
    { label: 'First Name', value: data.firstName },
    { label: 'Last Name', value: data.lastName },
    { label: 'Email', value: data.email },
    { label: 'Country', value: data.country },
    { label: 'Phone', value: data.phone },
    { label: 'Preferred Contact Method', value: data.contactPreference },
  ];
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
        paragraph2: "To get started, please click the button below to join our onboarding WhatsApp group. This is where you'll receive next steps, meet fellow participants, and get all the details about our bible study.",
        ctaButtons: [
          {
            label: 'Join WhatsApp Group',
            url: 'https://chat.whatsapp.com/FGA9UkTb1mY0MnFGCgHTGc',
          }
        ],
        paragraph3: `We host regular onboarding sessions to help you understand our mission, structure, and what to expect during our weekly studies.`,
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

// ---- SMS (Twilio) ----
async function sendWelcomeSMS(firstName: string, phone: string) {
  if (!ENABLE_SMS) return 'skipped';
  if (!process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_FROM_NUMBER) {
    console.warn('Twilio env vars missing');
    return 'skipped';
  }
  if (!phone.startsWith('+')) {
    console.warn('Phone not E.164, skipping SMS');
    return 'failed';
  }
  try {
    const auth = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString('base64');

    const params = new URLSearchParams({
      To: phone.trim(),
      From: process.env.TWILIO_FROM_NUMBER,
      Body: `Hi ${firstName}, welcome to the Antioch Bible Study! We're excited to have you join us.`
    });

    const resp = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      }
    );

    if (!resp.ok) {
      console.error('Twilio error:', await resp.text());
      return 'failed';
    }
    console.log("SMS Sent", await resp.json());
    return 'sent';
  } catch (e) {
    console.error('Twilio exception:', e);
    return 'failed';
  }
}

// ---- Handler ----
export async function POST(req: NextRequest) {
  const body = await req.json();
  let { firstName, lastName, email, country, phone, contactPreference, otherContactDetail } = body;


  firstName = normalizeName(firstName);
  lastName = normalizeName(lastName);

  const missing: string[] = [];
  if (!firstName) missing.push('First Name');
  if (!lastName) missing.push('Last Name');
  if (!email) missing.push('Email');
  if (!country) missing.push('Country');
  if (!phone) missing.push('Phone');
  if (!contactPreference) missing.push('Preferred Contact Method');
  if (contactPreference === 'Other' && !otherContactDetail) missing.push('Other Contact Detail');

  if (missing.length) {
    return NextResponse.json({ error: 'Missing fields', missing }, { status: 400 });
  }

  try {
    const listItems = buildListItems({
      firstName,
      lastName,
      email,
      country,
      phone,
      contactPreference,
      otherContactDetail
    });

    // Email statuses
    let adminEmailStatus: 'skipped' | 'sent' | 'failed' = 'skipped';
    let userEmailStatus: 'skipped' | 'sent' | 'failed' = 'skipped';

    if (ENABLE_EMAILS) {
      const transporter = getTransporter();
      if (!transporter) {
        console.warn('Email transporter unavailable');
      } else {
        adminEmailStatus = await sendAdminEmail(transporter, listItems, firstName, lastName, email, phone);
        userEmailStatus = await sendUserEmail(transporter, listItems, firstName, lastName, email);
      }
    }

    // Conditional SMS (only if preference === SMS)
    let smsStatus: 'skipped' | 'sent' | 'failed' = 'skipped';
    if (contactPreference === 'SMS') {
      smsStatus = await sendWelcomeSMS(firstName, phone);
    }

    return NextResponse.json({
      success: true,
      adminEmailStatus,
      userEmailStatus,
      smsStatus,
      featureFlags: {
        emails: ENABLE_EMAILS,
        sms: ENABLE_SMS
      }
    });
  } catch (e) {
    console.error('API error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}