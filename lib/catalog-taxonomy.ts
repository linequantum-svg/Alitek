const ORDERED_CATEGORIES = [
  "Маркери",
  "Годинники",
  "Годинники Skmei",
  "Годинники Olevs",
  "Смарт-годинники",
  "Дитячі годинники",
  "Ремінці",
  "Навушники",
  "Навушники TWS",
  "Накладні навушники",
  "Чохли для навушників",
  "Комплекти",
  "Світильники",
  "Адаптери",
  "Павербанки, зарядні пристрої",
  "Чохли для телефонів",
] as const;

const EXACT_CATEGORY_ALIASES = new Map<string, string>(
  ORDERED_CATEGORIES.map((name) => [normalize(name), name])
);

type Rule = {
  category: string;
  test: (text: string) => boolean;
};

const RULES: Rule[] = [
  {
    category: "Маркери",
    test: (text) =>
      hasAny(text, ["маркер", "фломастер", "marker", "brush marker", "acrylic marker", "sketch marker"]),
  },
  {
    category: "Годинники Skmei",
    test: (text) => hasAny(text, ["skmei"]),
  },
  {
    category: "Годинники Olevs",
    test: (text) => hasAny(text, ["olevs"]),
  },
  {
    category: "Дитячі годинники",
    test: (text) => hasAny(text, ["дитяч", "детск", "kid watch", "kids watch", "child watch"]),
  },
  {
    category: "Смарт-годинники",
    test: (text) =>
      hasAny(text, ["смарт-годин", "смарт годин", "smart watch", "watch 8", "watch ultra", "fit pro", "hw", "kw"]),
  },
  {
    category: "Ремінці",
    test: (text) => hasAny(text, ["ремінец", "ремеш", "strap", "band for watch", "браслет для годинника"]),
  },
  {
    category: "Навушники TWS",
    test: (text) =>
      hasAny(text, ["tws", "earbuds", "airpods", "inpods", "i12", "i7s", "бездротові навушники", "bluetooth навушники"]),
  },
  {
    category: "Чохли для навушників",
    test: (text) => hasAny(text, ["чохол для навуш", "case for airpods", "case for earbuds", "case for tws"]),
  },
  {
    category: "Накладні навушники",
    test: (text) =>
      hasAny(text, ["накладн", "headset", "gaming headset", "гарнітур", "headphone", "навушники pc", "навушники gaming"]),
  },
  {
    category: "Комплекти",
    test: (text) =>
      hasAny(text, ["комплект", "набір", "set", "bundle", "2 в 1", "3 в 1", "watch +", "+ tws", "smartwatch ultra навушники"]),
  },
  {
    category: "Світильники",
    test: (text) => hasAny(text, ["світиль", "лампа", "нічник", "led lamp", "night light", "table lamp"]),
  },
  {
    category: "Адаптери",
    test: (text) =>
      hasAny(text, ["адаптер", "adapter", "dongle", "usb bluetooth", "bluetooth adapter", "перехідник"]),
  },
  {
    category: "Павербанки, зарядні пристрої",
    test: (text) =>
      hasAny(text, ["power bank", "powerbank", "павербанк", "зарядн", "charger", "magsafe", "акумулятор", "battery pack"]),
  },
  {
    category: "Чохли для телефонів",
    test: (text) =>
      hasAny(text, ["чохол для телефон", "чохол для iphone", "чехол для телефона", "phone case", "iphone case"]),
  },
  {
    category: "Годинники",
    test: (text) => hasAny(text, ["годинник", "watch", "wrist watch"]),
  },
  {
    category: "Навушники",
    test: (text) => hasAny(text, ["навуш", "earphone", "earbud", "гарнітур"]),
  },
];

function normalize(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text: string, parts: string[]) {
  return parts.some((part) => text.includes(part));
}

export function getCatalogCategoryRank(categoryName: string) {
  const normalized = normalize(categoryName);
  const exact = EXACT_CATEGORY_ALIASES.get(normalized) || categoryName;
  const index = ORDERED_CATEGORIES.indexOf(exact as (typeof ORDERED_CATEGORIES)[number]);
  return index === -1 ? ORDERED_CATEGORIES.length + 100 : index;
}

export function sortCatalogCategories(categories: string[]) {
  return Array.from(new Set(categories.filter(Boolean)))
    .sort((a, b) => {
      const rankDiff = getCatalogCategoryRank(a) - getCatalogCategoryRank(b);
      return rankDiff !== 0 ? rankDiff : a.localeCompare(b, "uk");
    });
}

export function normalizeCatalogCategory(...values: Array<string | null | undefined>) {
  const normalizedValues = values
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  for (const value of normalizedValues) {
    const exact = EXACT_CATEGORY_ALIASES.get(normalize(value));
    if (exact) return exact;
  }

  const haystack = normalize(normalizedValues.join(" "));
  if (!haystack) return "Інше";

  for (const rule of RULES) {
    if (rule.test(haystack)) return rule.category;
  }

  return normalizedValues[0] || "Інше";
}
