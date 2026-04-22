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

const DISPLAY_CATEGORIES = [
  "Маркери",
  "Годинники Skmei",
  "Годинники Olevs",
  "Смарт-годинники",
  "Дитячі годинники",
  "Ремінці",
  "Навушники TWS",
  "Накладні навушники",
  "Чохли для навушників",
  "Комплекти",
  "Світильники",
  "Адаптери",
  "Павербанки, зарядні пристрої",
  "Чохли для телефонів",
] as const;

const CATEGORY_GROUP_DEFINITIONS = [
  {
    title: "Маркери",
    items: ["Маркери"],
  },
  {
    title: "Годинники",
    items: [
      "Годинники Skmei",
      "Годинники Olevs",
      "Смарт-годинники",
      "Дитячі годинники",
      "Ремінці",
    ],
  },
  {
    title: "Навушники",
    items: ["Навушники TWS", "Накладні навушники", "Чохли для навушників"],
  },
  {
    title: "Інше",
    items: ["Комплекти", "Світильники", "Адаптери", "Павербанки, зарядні пристрої", "Чохли для телефонів"],
  },
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

export function getDisplayCatalogCategories(categories: string[], limit?: number) {
  const uniqueCategories = Array.from(new Set(categories.filter(Boolean)));
  const byNormalizedName = new Map(uniqueCategories.map((name) => [normalize(name), name]));

  const display = DISPLAY_CATEGORIES.map((name) => byNormalizedName.get(normalize(name))).filter(
    (value): value is string => Boolean(value),
  );

  const remaining = uniqueCategories.filter(
    (name) =>
      !display.some((displayName) => normalize(displayName) === normalize(name)) &&
      !["годинники", "навушники"].includes(normalize(name)),
  );

  const merged = [...display, ...sortCatalogCategories(remaining)];
  return typeof limit === "number" ? merged.slice(0, Math.max(0, limit)) : merged;
}

export type CatalogCategoryGroup = {
  title: string;
  items: string[];
};

export function getCatalogCategoryGroups(categories: string[]) {
  const displayCategories = getDisplayCatalogCategories(categories);
  const normalizedAvailable = new Map(displayCategories.map((name) => [normalize(name), name]));
  const used = new Set<string>();

  const groups: CatalogCategoryGroup[] = CATEGORY_GROUP_DEFINITIONS.map((group) => {
    const items = group.items
      .map((item) => normalizedAvailable.get(normalize(item)))
      .filter((value): value is string => Boolean(value));

    for (const item of items) used.add(normalize(item));

    return {
      title: group.title,
      items,
    };
  }).filter((group) => group.items.length > 0);

  const remaining = displayCategories.filter((item) => !used.has(normalize(item)));
  if (remaining.length > 0) {
    groups.push({
      title: "Ще категорії",
      items: remaining,
    });
  }

  return groups;
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
