import { createI18n } from "vue-i18n";
import session from "@utils/session";

function loadMessages() {
  const context = require.context("../lang", true, /[a-z0-9-_]+\.json$/i);
  const messages = context
    .keys()
    .map((key) => ({ key, locale: key.match(/[a-z0-9-_]+/i)[0] }))
    .reduce(
      (messages, { key, locale }) => ({
        ...messages,
        [locale]: context(key),
      }),
      {}
    );
  return { context, messages };
}

const { messages } = loadMessages();

const langs = Object.keys(messages);
const namespaces = [
  "constants",
  "errors",
  "navs",
  "nftproperty",
  "kgstarter",
  "metaverse",
];
langs.forEach((lang) => {
  namespaces.forEach((key) => {
    for (let i in messages[lang][key]) {
      messages[lang][i] = messages[lang][key][i];
    }
    if (key === "constants") {
      delete messages[lang][key];
    }
  });
});

// console.log("messages", messages);

const getLang = () => {
  let lang = session.getItem("language");
  if (lang) {
    return lang;
  }
  session.setItem("language", "en");
  return "en";
};
const i18n = createI18n({
  locale: getLang(), // 语言标识
  globalInjection: true, // global load
  fallbackLocale: "en",
  legacy: false, // you must set `false`, to use Composition API
  messages,
});

export default i18n;
