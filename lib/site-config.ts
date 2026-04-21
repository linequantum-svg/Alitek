export const SITE_CONFIG = {
  brandName: "Alitek",
  phoneDisplay: "+38 (000) 000-00-00",
  phoneHref: "tel:+380000000000",
  telegramUsername: "ArtemK90",
  telegramDisplay: "t.me/ArtemK90",
  email: "you@example.com",
  address: "Україна",
  freeShippingFrom: 1500,
};

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

export function getTelegramProfileUrl() {
  return `https://t.me/${SITE_CONFIG.telegramUsername}`;
}
