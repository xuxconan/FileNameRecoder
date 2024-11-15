import { I18n } from "i18n-js";
import en from "./en";
import zh from "./zh";

const i18n = new I18n({ en, zh });
i18n.defaultLocale = en.name;
i18n.locale = en.name;

export const setLocale = (targetName: string) => {
  if (!targetName || typeof targetName !== "string")
    return i18n.locale = i18n.defaultLocale;
  targetName = targetName.toLocaleLowerCase().replace("-", "_");
  const names = Object.keys(i18n.translations).map((name) => name.toLowerCase().replace("-", "_"));
  const exact = names.find((name) => name === targetName);
  if (exact) return i18n.locale = exact;
  const similar = names
    .find((name) => targetName.length > name.length
      ? targetName.includes(name)
      : name.includes(targetName));
  if (similar) return i18n.locale = similar;
  return i18n.locale = i18n.defaultLocale;
}

export default i18n;
