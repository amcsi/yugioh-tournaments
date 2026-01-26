import type { Tournament } from "../types/tournament";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { getStoreType } from "../utils/storeUtils";
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

// Permanent stores that should always be shown, with their default city names
const PERMANENT_STORES: Array<{ namePattern: string; type: string; defaultCity: string }> = [
  { namePattern: "metagame", type: "Metagame", defaultCity: "Budapest" },
  { namePattern: "remete", type: "Remetebarlang", defaultCity: "Vác" },
  { namePattern: "sas", type: "SAS és KOS", defaultCity: "Győr" },
  { namePattern: "pöttyös", type: "Pöttyös Zebra", defaultCity: "Szeged" },
  { namePattern: "sport", type: "Sport Kártya", defaultCity: "Veszprém" },
  { namePattern: "bar of legends", type: "BoL", defaultCity: "Győr" },
  { namePattern: "játék", type: "Játék Céh", defaultCity: "Debrecen" },
  { namePattern: "ratmayer", type: "Ratmayer", defaultCity: "Szombathely" },
];

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
      const city = getCityFromTournament(tournament) || "Unknown";
      const existing = storeMap.get(storeName) || { 
        count: 0, 
        type: getStoreType(storeName),
        city: city,
      };
      existing.count++;
      // Update city if we find a different one (should be same, but just in case)
      if (city && city !== "Unknown" && (!existing.city || existing.city === "Unknown")) {
        existing.city = city;
      }
      storeMap.set(storeName, existing);
    }
  });

  // Create a map of permanent stores - ensure all permanent store types are always shown
  const permanentStoreMap = new Map<string, { count: number; type: string; city: string }>();

  // For each permanent store type, find matching stores or create placeholder
  PERMANENT_STORES.forEach(({ namePattern, type, defaultCity }) => {
    // Find all stores that match this permanent store type
    const matchingStores: Array<{ name: string; info: { count: number; type: string; city: string } }> = [];

    storeMap.forEach((info, storeName) => {
      if (info.type === type) {
        matchingStores.push({ name: storeName, info });
      }
    });

    if (matchingStores.length > 0) {
      // Use the first matching store (or merge if multiple)
      const firstStore = matchingStores[0];
      permanentStoreMap.set(firstStore.name, firstStore.info);
    } else {
      // No tournaments for this store type - create placeholder
      permanentStoreMap.set(type, {
        count: 0,
        type: type,
        city: defaultCity,
      });
    }
  });

  // Get all non-permanent stores (type === "Other")
  const otherStoresList: StoreInfo[] = Array.from(storeMap.entries())
    .filter(([_, info]) => info.type === "Other")
    .map(([name, info]) => ({ name, ...info }));

  // Convert permanent stores to array and sort: Metagame first, Remetebarlang second, then by count
  const permanentStores: StoreInfo[] = Array.from(permanentStoreMap.entries())
    .map(([name, info]) => ({ name, ...info }))
    .sort((a, b) => {
      const priorityA = getStorePriority(a.type);
      const priorityB = getStorePriority(b.type);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return b.count - a.count;
    });

  // Check if any "other" stores are selected
  const hasOtherSelected = otherStoresList.length > 0 && otherStoresList.some((store) => selectedStores.has(store.name));

  return (
    <div className="store-filter">
      <h3 className="filter-title">{t.filterByStore}</h3>
      <div className="store-buttons">
        {permanentStores.map((store) => (
          <button
            key={store.name}
            className={`store-button ${selectedStores.has(store.name) ? "active" : ""} ${store.count === 0 ? "disabled" : ""}`}
            onClick={() => store.count > 0 && onStoreToggle(store.name)}
            disabled={store.count === 0}
          >
            <span className="store-name">
              {store.name}
              {store.city && <span className="store-city"> ({store.city})</span>}
            </span>
            <span className="store-badge">{getStoreTypeLabel(store.type, language)}</span>
            <span className="store-count">({store.count})</span>
          </button>
        ))}
        <button
          className={`store-button other-stores ${hasOtherSelected ? "active" : ""} ${otherStoresList.length === 0 ? "disabled" : ""}`}
          onClick={() => otherStoresList.length > 0 && onOtherStoresToggle()}
          disabled={otherStoresList.length === 0}
        >
          <span className="store-name">{t.otherStores}</span>
          <span className="store-count">({otherStoresList.length})</span>
        </button>
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
  
  return "Unknown";
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
