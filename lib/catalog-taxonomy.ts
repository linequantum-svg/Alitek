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
  { title: "Маркери", items: ["Маркери"] },
  {
    title: "Годинники",
    items: ["Годинники Skmei", "Годинники Olevs", "Смарт-годинники", "Дитячі годинники", "Ремінці"],
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

const EXACT_CATEGORY_ALIASES = new Map<string, string>(ORDERED_CATEGORIES.map((name) => [normalize(name), name]));

export type CatalogCategoryRecord = {
  id: string;
  name: string;
  parentExternalId: string | null;
};

export type CatalogCategoryGroup = {
  title: string;
  items: string[];
};

type Rule = {
  category: string;
  test: (text: string) => boolean;
};

const RULES: Rule[] = [
  {
    category: "Маркери",
    test: (text) => hasAny(text, ["маркер", "фломастер", "marker", "brush marker", "acrylic marker", "sketch marker"]),
  },
  { category: "Годинники Skmei", test: (text) => hasAny(text, ["skmei"]) },
  { category: "Годинники Olevs", test: (text) => hasAny(text, ["olevs"]) },
  {
    category: "Дитячі годинники",
    test: (text) => hasAny(text, ["дитяч", "детск", "kid watch", "kids watch", "child watch"]),
  },
  {
    category: "Смарт-годинники",
    test: (text) => hasAny(text, ["смарт-годин", "смарт годин", "smart watch", "watch 8", "watch ultra", "fit pro", "hw", "kw"]),
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
    test: (text) => hasAny(text, ["комплект", "набір", "set", "bundle", "2 в 1", "3 в 1", "watch +", "+ tws"]),
  },
  {
    category: "Світильники",
    test: (text) => hasAny(text, ["світиль", "лампа", "нічник", "led lamp", "night light", "table lamp"]),
  },
  {
    category: "Адаптери",
    test: (text) => hasAny(text, ["адаптер", "adapter", "dongle", "usb bluetooth", "bluetooth adapter", "перехідник"]),
  },
  {
    category: "Павербанки, зарядні пристрої",
    test: (text) =>
      hasAny(text, ["power bank", "powerbank", "павербанк", "зарядн", "charger", "magsafe", "акумулятор", "battery pack"]),
  },
  {
    category: "Чохли для телефонів",
    test: (text) => hasAny(text, ["чохол для телефон", "чехол для телефона", "phone case", "iphone case"]),
  },
  { category: "Годинники", test: (text) => hasAny(text, ["годинник", "watch", "wrist watch"]) },
  { category: "Навушники", test: (text) => hasAny(text, ["навуш", "earphone", "earbud", "гарнітур"]) },
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

function isCategoryRecord(value: string | CatalogCategoryRecord): value is CatalogCategoryRecord {
  return typeof value === "object" && value !== null && "name" in value;
}

function sortNames(names: string[]) {
  return Array.from(new Set(names.filter(Boolean))).sort((a, b) => {
    const rankDiff = getCatalogCategoryRank(a) - getCatalogCategoryRank(b);
    return rankDiff !== 0 ? rankDiff : a.localeCompare(b, "uk");
  });
}

function getFallbackGroups(categories: string[]) {
  const displayCategories = getDisplayCatalogCategories(categories);
  const normalizedAvailable = new Map(displayCategories.map((name) => [normalize(name), name]));
  const used = new Set<string>();

  const groups: CatalogCategoryGroup[] = CATEGORY_GROUP_DEFINITIONS.map((group) => {
    const items = group.items
      .map((item) => normalizedAvailable.get(normalize(item)))
      .filter((value): value is string => Boolean(value));

    for (const item of items) used.add(normalize(item));

    return { title: group.title, items };
  }).filter((group) => group.items.length > 0);

  const remaining = displayCategories.filter((item) => !used.has(normalize(item)));
  if (remaining.length > 0) {
    groups.push({ title: "Ще категорії", items: remaining });
  }

  return groups;
}

function getTopAncestor(record: CatalogCategoryRecord, byId: Map<string, CatalogCategoryRecord>) {
  let current = record;
  const visited = new Set<string>();

  while (current.parentExternalId && byId.has(current.parentExternalId) && !visited.has(current.parentExternalId)) {
    visited.add(current.id);
    current = byId.get(current.parentExternalId)!;
  }

  return current;
}

function getHierarchicalGroups(records: CatalogCategoryRecord[]) {
  const uniqueRecords = records.filter(
    (record, index, arr) => arr.findIndex((item) => item.id === record.id || normalize(item.name) === normalize(record.name)) === index,
  );

  const byId = new Map(uniqueRecords.map((record) => [record.id, record]));
  const groupsMap = new Map<string, string[]>();
  const rootOrder: Array<{ id: string; name: string }> = [];

  for (const record of uniqueRecords) {
    const top = getTopAncestor(record, byId);
    if (!groupsMap.has(top.id)) {
      groupsMap.set(top.id, []);
      rootOrder.push({ id: top.id, name: top.name });
    }

    if (record.id !== top.id) {
      const items = groupsMap.get(top.id)!;
      if (!items.some((item) => normalize(item) === normalize(record.name))) {
        items.push(record.name);
      }
    }
  }

  return rootOrder.map(({ id: rootId, name: rootName }) => {
    const items = groupsMap.get(rootId) || [];
    return {
      title: rootName,
      items: items.length > 0 ? items : [rootName],
    };
  });
}

export function getCatalogCategoryRank(categoryName: string) {
  const normalized = normalize(categoryName);
  const exact = EXACT_CATEGORY_ALIASES.get(normalized) || categoryName;
  const index = ORDERED_CATEGORIES.indexOf(exact as (typeof ORDERED_CATEGORIES)[number]);
  return index === -1 ? ORDERED_CATEGORIES.length + 100 : index;
}

export function sortCatalogCategories(categories: string[]) {
  return sortNames(categories);
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

export function getCatalogCategoryGroups(categories: Array<string | CatalogCategoryRecord>) {
  if (categories.length === 0) return [];
  return isCategoryRecord(categories[0])
    ? getHierarchicalGroups(categories as CatalogCategoryRecord[])
    : getFallbackGroups(categories as string[]);
}

export function normalizeCatalogCategory(...values: Array<string | null | undefined>) {
  const normalizedValues = values.map((value) => String(value || "").trim()).filter(Boolean);

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
