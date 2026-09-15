/** Extract numeric amount from feature.price (e.g. "50 ريال" → 50). "مشمول" → 0. */
export function parseFeaturePrice(feature) {
  if (!feature || feature.price == null) return 0;
  const str = String(feature.price).trim();
  if (str === "مشمول" || str === "") return 0;
  const match = str.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  return parseFloat(match[1]);
}

export function formatOfferPriceString(total) {
  const n = Math.round(total * 100) / 100;
  if (Number.isNaN(n)) return "0";
  if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
  return n.toFixed(2);
}

/** Base offer.price + sum of selected features' prices (مشمول counts as 0). */
export function computeOfferDisplayTotal(offer, offerIndex, selection) {
  const base = parseFloat(String(offer.price).replace(/,/g, "")) || 0;
  let extras = 0;
  offer.features.forEach((f, i) => {
    if (isFeatureChecked(selection, offerIndex, i, f)) {
      extras += parseFeaturePrice(f);
    }
  });
  return base + extras;
}

/** Default: included base benefits (مشمول) start selected; paid add-ons start unchecked. */
export function getDefaultFeatureSelected(feature) {
  return feature.price === "مشمول";
}

export function isFeatureChecked(selection, offerIndex, featureIndex, feature) {
  const v = selection[offerIndex]?.[featureIndex];
  if (v !== undefined) return v;
  return getDefaultFeatureSelected(feature);
}

export function toggleFeatureSelection(setSelection, offerIndex, featureIndex, feature) {
  setSelection((prev) => {
    const cur = { ...(prev[offerIndex] || {}) };
    const current =
      cur[featureIndex] !== undefined
        ? cur[featureIndex]
        : getDefaultFeatureSelected(feature);
    cur[featureIndex] = !current;
    return { ...prev, [offerIndex]: cur };
  });
}

/** Map an offer/UI payload to the Order.companyData schema (name, options, checked). */
export function toSchemaCompanyData(raw) {
  if (!raw || typeof raw !== "object") return undefined;
  const items = Array.isArray(raw.options)
    ? raw.options
    : Array.isArray(raw.features)
      ? raw.features
      : [];
  return {
    name: String(raw.name || raw.company || ""),
    nameKey: String(raw.nameKey || ""),
    logo: String(raw.logo || ""),
    price: parseFeaturePrice({ price: raw.price }),
    options: items.map((item) => ({
      label: String(item.label || item.text || ""),
      labelKey: String(item.labelKey || ""),
      price: parseFeaturePrice(item),
      checked: Boolean(item.checked ?? item.selected),
    })),
  };
}

/** Attach `selected` to each feature; set `price` to computed total for checkout. */
export function enrichOfferWithSelection(offer, offerIndex, selection) {
  const total = computeOfferDisplayTotal(offer, offerIndex, selection);
  return {
    ...offer,
    basePrice: offer.price,
    price: formatOfferPriceString(total),
    features: offer.features.map((f, i) => ({
      ...f,
      selected: isFeatureChecked(selection, offerIndex, i, f),
    })),
  };
}
