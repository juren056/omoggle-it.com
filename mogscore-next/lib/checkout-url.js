/** Client-safe Payment Link URL builder (no Stripe SDK). */
export function buildPaymentLinkUrl(linkUrl, { userId, email }) {
  const url = new URL(linkUrl)
  if (userId) url.searchParams.set('client_reference_id', userId)
  if (email) url.searchParams.set('prefilled_email', email)
  return url.toString()
}

export function resolveCheckoutMode() {
  const checkoutMode = process.env.STRIPE_CHECKOUT_MODE || 'auto'
  const priceIdMonthly = process.env.STRIPE_PRICE_ID_MONTHLY
  const paymentLinkMonthly = process.env.STRIPE_PAYMENT_LINK_MONTHLY || null
  const paymentLinkYearly = process.env.STRIPE_PAYMENT_LINK_YEARLY || null
  const usePaymentLink = !!(paymentLinkMonthly && paymentLinkYearly && (
    checkoutMode === 'payment_link' || (checkoutMode === 'auto' && !priceIdMonthly)
  ))
  return {
    usePaymentLink,
    paymentLinks: usePaymentLink
      ? { monthly: paymentLinkMonthly, yearly: paymentLinkYearly }
      : null,
  }
}
