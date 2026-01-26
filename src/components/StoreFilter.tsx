import type { Tournament } from "../types/tournament";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import "./StoreFilter.css";

interface StoreFilterProps {
  tournaments: Tournament[];
  selectedStores: Set<string>;
  onStoreToggle: (storeName: string) => void;
  onOtherStoresToggle: () => void;
  onClearFilter: () => void;
}

interface StoreInfo {
  name: string;
  count: number;
  type: string;
  city: string;
}

export function StoreFilter({
  tournaments,
  selectedStores,
  onStoreToggle,
  onOtherStoresToggle,
  onClearFilter,
}: StoreFilterProps) {
  const { language } = useLanguage();
  const t = translations[language];
  // Extract unique stores and count tournaments per store
  const storeMap = new Map<string, { count: number; type: string; city: string }>();

  tournaments.forEach((tournament) => {
    const storeName = tournament.storeName || tournament.locationName;
    if (storeName) {
      const city = getCityFromTournament(tournament);
      const existing = storeMap.get(storeName) || { 
        count: 0, 
        type: getStoreType(storeName),
        city: city,
      };
      existing.count++;
      // Update city if we find a different one (should be same, but just in case)
      if (city && !existing.city) {
        existing.city = city;
      }
      storeMap.set(storeName, existing);
    }
  });

  // Convert to array and sort: Metagame first, Remetebarlang second, then by count
  const stores: StoreInfo[] = Array.from(storeMap.entries())
    .map(([name, info]) => ({ name, ...info }))
    .sort((a, b) => {
      const priorityA = getStorePriority(a.type);
      const priorityB = getStorePriority(b.type);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return b.count - a.count;
    });

  // Determine which stores are "main" stores (top stores) and which are "other"
  // We'll show top 8 stores as main, rest as "other"
  const mainStores = stores.slice(0, 8);
  const otherStores = stores.slice(8);
  const hasOtherStores = otherStores.length > 0;

  // Check if any "other" stores are selected
  const hasOtherSelected = hasOtherStores && otherStores.some((store) => selectedStores.has(store.name));

  return (
    <div className="store-filter">
      <h3 className="filter-title">{t.filterByStore}</h3>
      <div className="store-buttons">
        {mainStores.map((store) => (
          <button
            key={store.name}
            className={`store-button ${selectedStores.has(store.name) ? "active" : ""}`}
            onClick={() => onStoreToggle(store.name)}
          >
            <span className="store-name">
              {store.name}
              {store.city && <span className="store-city"> ({store.city})</span>}
            </span>
            <span className="store-badge">{getStoreTypeLabel(store.type, language)}</span>
            <span className="store-count">({store.count})</span>
          </button>
        ))}
        {hasOtherStores && (
          <button
            className={`store-button other-stores ${hasOtherSelected ? "active" : ""}`}
            onClick={onOtherStoresToggle}
          >
            <span className="store-name">{t.otherStores}</span>
            <span className="store-count">({otherStores.length})</span>
          </button>
        )}
      </div>
      {selectedStores.size > 0 && (
        <button className="clear-filter" onClick={onClearFilter}>
          {t.clearFilter}
        </button>
      )}
    </div>
  );
}

function getCityFromTournament(tournament: Tournament): string {
  // Try to get city from location.address1 (most reliable)
  if (tournament.location?.address1) {
    return tournament.location.address1;
  }
  
  // Fallback to parsing from address string
  if (tournament.address) {
    // Address format is typically "8200 Veszprém Horgos u. 3."
    // Extract city name (usually the second word)
    const parts = tournament.address.trim().split(/\s+/);
    if (parts.length >= 2) {
      // Skip postal code (first part) and get city (second part)
      return parts[1];
    }
  }
  
  return "";
}

function getStoreType(storeName: string): string {
  const name = storeName.toLowerCase();
  
  if (name.includes("metagame")) {
    return "Metagame";
  } else if (name.includes("remete") || name.includes("remetebarlang")) {
    return "Remetebarlang";
  } else if (name.includes("sas") || name.includes("kos")) {
    return "SAS és KOS";
  } else if (name.includes("pöttyös") || name.includes("zebra")) {
    return "Pöttyös Zebra";
  } else if (name.includes("sport") || name.includes("kártya")) {
    return "Sport Kártya";
  } else if (name.includes("bar of legends") || name.includes("bol")) {
    return "BoL";
  } else if (name.includes("játék") && name.includes("céh")) {
    return "Játék Céh";
  } else if (name.includes("ratmayer")) {
    return "Ratmayer";
  } else {
    return "Other";
  }
}

function getStoreTypeLabel(storeType: string, language: "hu" | "en"): string {
  const t = translations[language];
  switch (storeType) {
    case "Metagame":
      return t.storeTypeMetagame;
    case "Remetebarlang":
      return t.storeTypeRemetebarlang;
    case "SAS és KOS":
      return t.storeTypeSasKos;
    case "Pöttyös Zebra":
      return t.storeTypePottyosZebra;
    case "Sport Kártya":
      return t.storeTypeSportKartya;
    case "BoL":
      return t.storeTypeBoL;
    case "Játék Céh":
      return t.storeTypeJatekCeh;
    case "Ratmayer":
      return t.storeTypeRatmayer;
    case "Other":
      return t.storeTypeOther;
    default:
      return storeType;
  }
}

function getStorePriority(storeType: string): number {
  // Lower number = higher priority
  if (storeType === "Metagame") {
    return 1;
  } else if (storeType === "Remetebarlang") {
    return 2;
  } else {
    return 100; // All others sorted by count
  }
}
