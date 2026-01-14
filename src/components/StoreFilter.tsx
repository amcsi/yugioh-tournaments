import type { Tournament } from "../types/tournament";
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
}

export function StoreFilter({
  tournaments,
  selectedStores,
  onStoreToggle,
  onOtherStoresToggle,
  onClearFilter,
}: StoreFilterProps) {
  // Extract unique stores and count tournaments per store
  const storeMap = new Map<string, { count: number; type: string }>();

  tournaments.forEach((tournament) => {
    const storeName = tournament.storeName || tournament.locationName;
    if (storeName) {
      const existing = storeMap.get(storeName) || { count: 0, type: getStoreType(storeName) };
      existing.count++;
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
      <h3 className="filter-title">Szűrés bolt szerint</h3>
      <div className="store-buttons">
        {mainStores.map((store) => (
          <button
            key={store.name}
            className={`store-button ${selectedStores.has(store.name) ? "active" : ""}`}
            onClick={() => onStoreToggle(store.name)}
          >
            <span className="store-name">{store.name}</span>
            <span className="store-badge">{store.type}</span>
            <span className="store-count">({store.count})</span>
          </button>
        ))}
        {hasOtherStores && (
          <button
            className={`store-button other-stores ${hasOtherSelected ? "active" : ""}`}
            onClick={onOtherStoresToggle}
          >
            <span className="store-name">Egyéb boltok</span>
            <span className="store-count">({otherStores.length})</span>
          </button>
        )}
      </div>
      {selectedStores.size > 0 && (
        <button className="clear-filter" onClick={onClearFilter}>
          Szűrés törlése
        </button>
      )}
    </div>
  );
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
  } else {
    return "Egyéb";
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
