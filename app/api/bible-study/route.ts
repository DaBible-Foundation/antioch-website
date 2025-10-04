import { emailTemplate } from '@/components/EmailTemplate';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // let { firstName, lastName, email, message, country, phone, gender, ageGroup } = body;
  // eslint-disable-next-line prefer-const
  let { firstName, lastName, email, country, phone, contactPreference, otherContactDetail } = body;

  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  // gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  // ageGroup = ageGroup.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  const missingFields = [];
  if (!firstName) missingFields.push('First Name');
  if (!lastName) missingFields.push('Last Name');
  if (!email) missingFields.push('Email');
  // if (!message) missingFields.push('little information about yourself');
  if (!country) missingFields.push('Country');
  if (!phone) missingFields.push('Phone');
  // if (!gender) missingFields.push('Gender');
  // if (!ageGroup) missingFields.push('age group');
  if (!contactPreference) missingFields.push('Preferred Contact Method');
  if (contactPreference === 'Other' && !otherContactDetail) missingFields.push('Other Contact Detail');

  if (missingFields.length > 0) {
    return NextResponse.json({ error: 'You need to specify your', missingFields }, { status: 400 });
  }

  try {
    // Send Emails via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.DABIBLE_GMAIL_ADDRESS,
        pass: process.env.DABIBLE_GMAIL_PASSWORD,
      },
    });

    const baseItems = [
      { label: 'First Name', value: firstName },
      { label: 'Last Name', value: lastName },
      { label: 'Email', value: email },
      { label: 'Country', value: country },
      { label: 'Phone', value: phone },
      { label: 'Preferred Contact Method', value: contactPreference },
    ];
    if (contactPreference === 'Other' && otherContactDetail) {
      baseItems.push({ label: 'Other Contact Detail', value: otherContactDetail });
    }

    const adminMail = {
      from: `"${firstName} ${lastName}" <${process.env.DABIBLE_GMAIL_ADDRESS}>`,
      to: process.env.DABIBLE_ADMIN_EMAIL,
      subject: `Bible Study Request from ${firstName} ${lastName}`,
      html: emailTemplate({
      firstName,
      lastName,
      title: 'New Antioch Bible Study Request',
      listItems: baseItems,
      paragraph1: `A new request has been made for the Antioch Bible Study program. Please review the details below.`,
      paragraph2: `You can contact the user directly at ${email} or via phone at ${phone}.`,
      paragraph4: `Thank you for your attention to this request.`,
    }),
    };

    const userMail = {
      from: `"DaBible Foundation" <${process.env.DABIBLE_GMAIL_ADDRESS}>`,
      to: email,
      subject: 'Thanks for showing interest in Antioch Bible Study',
      html: emailTemplate({
        firstName,
        lastName,
        title: 'Thank You for Your Interest in Antioch Bible Study', 
        listItems: baseItems,
        paragraph1: `We're thrilled to welcome you to the Antioch Bible Study family. You've just taken the first step toward a deeper, more vibrant walk with God, and you're not doing it alone.`,
        heading1: 'What Happens Next?',
        paragraph2: "To get started, please click the button below to join our onboarding WhatsApp group. This is where you'll receive next steps, meet fellow participants, and get all the details about our bible study.",
        ctaButtons: [
          {
            label: 'Join WhatsApp Group',
            url: 'https://chat.whatsapp.com/FGA9UkTb1mY0MnFGCgHTGc',
          }
        ],
        paragraph3: `We host regular onboarding sessions to help you understand our mission, structure, and what to expect during our weekly studies. You'll also have a chance to introduce yourself and ask questions.`,
        heading2: 'Your Registration Summary',
        paragraph4: `We can't wait to connect with you. Your spiritual growth matters to us, and we're honored to walk alongside you as you discover more of God's Word and His purpose for your life.`,
        
          })
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}