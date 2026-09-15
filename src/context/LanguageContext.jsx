import arLocale from "../locales/ar.json";

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function useTranslation() {
  const t = (key) => getNested(arLocale, key) ?? key;
  return { t, dir: "rtl", language: "ar" };
}
