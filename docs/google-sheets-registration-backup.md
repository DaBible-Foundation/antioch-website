# Google Sheets Registration Backup

This is a temporary backup path for Antioch Bible Study registrations while the CRM intake is finalized.

## Website environment

```env
GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL=https://script.google.com/macros/s/your-script-id/exec
GOOGLE_SHEETS_REGISTRATION_WEBHOOK_TOKEN=choose-a-private-shared-token
GOOGLE_SHEETS_TIMEOUT_MS=8000
```

If `GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL` is not set, the sheet sync is skipped and registrations continue normally.

## Apps Script

Create a Google Sheet, then open `Extensions -> Apps Script` and use this script:

```js
const SHEET_NAME = 'Registrations';
const EXPECTED_TOKEN = 'choose-a-private-shared-token';

const HEADERS = [
  'Submitted At',
  'First Name',
  'Last Name',
  'Name',
  'Email',
  'Phone',
  'Country',
  'Country Code',
  'Dial Code',
  'Street Address',
  'City',
  'State',
  'Zip Code',
  'Formatted Address',
  'Age Group',
  'Age Group Slug',
  'Is Teen',
  'Knows Antioch or DaBible',
  'Contact Preference',
  'Other Contact Detail',
  'Guardian First Name',
  'Guardian Last Name',
  'Guardian Name',
  'Guardian Phone',
  'Guardian Email',
  'Parent Consent Accepted',
  'Parent Signature Captured',
  'Payment Required',
  'Payment Status',
  'Payment Amount',
  'Payment Currency',
  'Payment Provider',
  'Checkout Session ID',
  'Checkout URL',
  'Idempotency Key'
];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');

  if (EXPECTED_TOKEN && payload.token !== EXPECTED_TOKEN) {
    return jsonResponse({ ok: false, error: 'Invalid token' }, 403);
  }

  const sheet = getSheet();
  const row = [
    payload.submittedAt,
    payload.firstName,
    payload.lastName,
    payload.name,
    payload.email,
    payload.phone,
    payload.country,
    payload.countryCode,
    payload.dialCode,
    payload.streetAddress,
    payload.city,
    payload.state,
    payload.zipCode,
    payload.formattedAddress,
    payload.ageGroup,
    payload.ageGroupSlug,
    payload.isTeen,
    payload.knowsAntiochOrDaBibleFoundation,
    payload.contactPreference,
    payload.otherContactDetail,
    payload.guardianFirstName,
    payload.guardianLastName,
    payload.guardianName,
    payload.guardianPhone,
    payload.guardianEmail,
    payload.parentConsentAccepted,
    payload.parentSignatureCaptured,
    payload.paymentRequired,
    payload.paymentStatus,
    payload.paymentAmount,
    payload.paymentCurrency,
    payload.paymentProvider,
    payload.checkoutSessionId,
    payload.checkoutUrl,
    payload.idempotencyKey
  ];

  sheet.appendRow(row);
  return jsonResponse({ ok: true });
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy it as a Web App:

- Execute as: `Me`
- Who has access: `Anyone`

Use the generated Web App URL as `GOOGLE_SHEETS_REGISTRATION_WEBHOOK_URL`.
