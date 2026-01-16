import { useLanguage } from "../contexts/LanguageContext";
import type { Language } from "../utils/translations";
import "./LanguageSelector.css";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; flag: string; name: string }[] = [
    { code: "hu", flag: "🇭🇺", name: "Magyar" },
    { code: "en", flag: "🇬🇧", name: "English" },
  ];

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-button ${language === lang.code ? "active" : ""}`}
          onClick={() => setLanguage(lang.code)}
          aria-label={`Switch to ${lang.name}`}
        >
          <span className="language-flag">{lang.flag}</span>
          <span className="language-name">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
