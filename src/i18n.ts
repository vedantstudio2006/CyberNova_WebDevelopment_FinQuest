import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  translation: {
    nav: {
      dashboard: "Dashboard",
      simulator: "Simulator",
      coach: "AI Coach",
      wallet: "Wallet",
      quizzes: "Quizzes",
      netWorth: "Net Worth",
      profile: "Profile"
    },
    common: {
      level: "Level",
      days: "days",
      language: "Language"
    }
  }
};

// Hindi translations
const hi = {
  translation: {
    nav: {
      dashboard: "डैशबोर्ड",
      simulator: "सिम्युलेटर",
      coach: "एआई कोच",
      wallet: "वॉलेट",
      quizzes: "प्रश्नोत्तरी",
      netWorth: "कुल संपत्ति",
      profile: "प्रोफ़ाइल"
    },
    common: {
      level: "स्तर",
      days: "दिन",
      language: "भाषा"
    }
  }
};

// Marathi translations
const mr = {
  translation: {
    nav: {
      dashboard: "डॅशबोर्ड",
      simulator: "सिम्युलेटर",
      coach: "एआय कोच",
      wallet: "वॉलेट",
      quizzes: "क्विझ",
      netWorth: "निवळ संपत्ती",
      profile: "प्रोफाइल"
    },
    common: {
      level: "स्तर",
      days: "दिवस",
      language: "भाषा"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en,
      hi,
      mr
    },
    lng: "en", // default language
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
