import { marketLinks, routeMap } from '../content';

export function pathFor(lang, key) {
  return routeMap[lang][key];
}

export function alternatePath(lang, key) {
  return lang === 'zh' ? routeMap.en[key] : routeMap.zh[key];
}

export function marketHrefFor(lang) {
  return marketLinks[lang] || marketLinks.zh;
}
