import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const TEEN_REGISTRATION_PRODUCT_ID = process.env.STRIPE_TEEN_REGISTRATION_PRODUCT_ID || 'prod_UjwAvbdAbdEcwp';

function getAmountCents(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = typeof body.discountCode === 'string' ? body.discountCode.trim() : '';
  const amountCents = getAmountCents(body.amountCents);

  if (!code) {
    return NextResponse.json({ error: 'Please enter a discount code.' }, { status: 400 });
  }

  if (!amountCents) {
    return NextResponse.json({ error: 'A valid registration total is required.' }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.basil',
  });

  const promotionCodes = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
  });

  const promotionCode = promotionCodes.data[0];
  const coupon = promotionCode?.coupon;
  const allowedProducts = coupon?.applies_to?.products || [];

  if (!promotionCode || !coupon?.valid) {
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

  const minimumAmount = promotionCode.restrictions?.minimum_amount || 0;
  const minimumCurrency = promotionCode.restrictions?.minimum_amount_currency;

  if (
    minimumAmount &&
    minimumCurrency?.toLowerCase() === 'usd' &&
    amountCents < minimumAmount
  ) {
    return NextResponse.json(
      { error: `This discount code requires a minimum registration total of $${(minimumAmount / 100).toFixed(2)}.` },
      { status: 400 }
    );
  }

  let discountAmountCents = 0;
  let description = '';

  if (coupon.percent_off) {
    discountAmountCents = Math.round(amountCents * (coupon.percent_off / 100));
    description = `${coupon.percent_off}% off`;
  } else if (coupon.amount_off && coupon.currency?.toLowerCase() === 'usd') {
    discountAmountCents = coupon.amount_off;
    description = `$${(coupon.amount_off / 100).toFixed(2)} off`;
  } else {
    return NextResponse.json(
      { error: 'This discount code cannot be applied to this registration.' },
      { status: 400 }
    );
  }

  discountAmountCents = Math.min(discountAmountCents, amountCents);
  const totalCents = Math.max(amountCents - discountAmountCents, 0);

  return NextResponse.json({
    code: promotionCode.code,
    description,
    discountAmountCents,
    subtotalCents: amountCents,
    totalCents,
  });
}
