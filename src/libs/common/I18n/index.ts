
import en from "./languages/en";
import zh from "./languages/zh";

export const TRANSLATE_FLAG = {
  FALLBACK_DEFAULT: 0x0001, // 当获取失败时尝试获取defaultLocale的对应文字
}

export type II18nProperty = {
  defaultLocale?: string;
  locale?: string;
  translations?: {[name: string]: any};
  translateFlag?: number;
}

export class I18n {
  protected property: II18nProperty;
  public defaultLocale?: string;
  public locale?: string;
  public translations?: {[name: string]: any};
  public translateFlag?: number;

  constructor(property?: II18nProperty) {
    property = JSON.parse(JSON.stringify(property ?? {}));
    this.property = property;
    try {
      const { reactive } = require("vue");
      this.property = reactive(property);
    } catch (e) {
      console.error(e);
    }

    Object.defineProperties(this, {
      defaultLocale: {
        get() { return this.property.defaultLocale; },
        set(value) { this.property.defaultLocale = value; }
      },
      locale: {
        get() { return this.property.locale; },
        set(value) {
          if (!value || typeof value !== "string")
            return this.property.locale = this.property.defaultLocale;
          value = value.toLocaleLowerCase().replace("-", "_");
          const names = Object.keys(this.property.translations ?? {})
            .map((name) => name.toLowerCase().replace("-", "_"));
          const exact = names.find((name) => name === value);
          if (exact) return this.property.locale = exact;
          const similar = names
            .find((name) => value.length > name.length
              ? value.includes(name)
              : name.includes(value));
          if (similar) return this.property.locale = similar;
          this.property.locale = this.property.defaultLocale;
        }
      },
      translations: {
        get() { return this.property.translations; },
        set(value) { this.property.translations = value; }
      },
      translateFlag: {
        get() { return this.property.translateFlag; },
        set(value) { this.property.translateFlag = value; }
      },
    })
  }

  public t(key: string, p?: string | {[key: string]: string}, ...params: string[]) {
    if (typeof p === "string") {
      params.push(p);
      p = {};
    }
    const map: {[key: string]: string} = {};
    for (let k in params) map[k] = params[k];
    for (let k in p) map[k] = p[k];

    const locale = this.locale ?? this.defaultLocale;
    const translation = this.getTranslation(key, locale);
    const formated = this.formatTranslation(translation, map);
    return formated;
  }

  protected getTranslation(key: string, locale?: string): string {
    const keys = key.split(/[\.|\/|\\]/ig);
    const translations = this.translations ?? {};
    let s = translations[locale];
    let k = keys.shift();
    while(typeof k !== "undefined") {
      s = s[k];
      if (typeof s === "undefined") break;
      k = keys.shift();
    }
    if (typeof s !== "string") {
      const flag = this.translateFlag | TRANSLATE_FLAG.FALLBACK_DEFAULT;
      if (!flag || locale === this.defaultLocale)
        throw new Error(`I18n translate failed! String of "${key}" is missing in "${locale}"!`);
      return this.getTranslation(key, this.defaultLocale);
    }
    return s;
  }

  protected formatTranslation(translation: string, params: {[key: string]: string}) {
    for (let key in params) {
      const val = params[key];
      const exp = new RegExp(`%${key}`, "ig");
      translation = translation.replace(exp, val);
    }
    return translation;
  }
}

const i18n = new I18n({
  defaultLocale: en.name,
  locale: en.name,
  translations: { en, zh },
});
export default i18n;
