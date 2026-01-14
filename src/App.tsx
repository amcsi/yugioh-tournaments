import { useState, useEffect, useMemo, type JSX } from 'react';
import { searchTournaments, createTournamentSearchRequest } from "./services/tournamentApi";
import type { Tournament } from "./types/tournament";
import { TournamentCard } from "./components/TournamentCard";
import { StoreFilter } from "./components/StoreFilter";
import { EventCategoryFilter } from "./components/EventCategoryFilter";
import { getEventCategory, type EventCategory } from "./utils/eventCategory";
import { groupTournamentsByWeek, getWeekInfo, isCurrentWeek } from "./utils/weekUtils";
import "./App.css";

function App() {
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());
  const [selectedEventCategories, setSelectedEventCategories] = useState<Set<EventCategory>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        setLoading(true);
        setError(null);
        const request = createTournamentSearchRequest();
        const response = await searchTournaments(request);
        setAllTournaments(response.result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nem sikerült betölteni a versenyeket");
        console.error("Error fetching tournaments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTournaments();
  }, []);

  // Filter tournaments based on selected stores and event categories
  const tournaments = useMemo(() => {
    return allTournaments.filter((tournament) => {
      // Filter by store
      if (selectedStores.size > 0) {
        const storeName = tournament.storeName || tournament.locationName;
        if (!storeName || !selectedStores.has(storeName)) {
          return false;
        }
      }

      // Filter by event category
      if (selectedEventCategories.size > 0) {
        const category = getEventCategory(tournament);
        if (!selectedEventCategories.has(category)) {
          return false;
        }
      }

      return true;
    });
  }, [allTournaments, selectedStores, selectedEventCategories]);

  // Get all stores for the "other stores" logic
  const allStores = useMemo(() => {
    const storeMap = new Map<string, number>();
    allTournaments.forEach((tournament) => {
      const storeName = tournament.storeName || tournament.locationName;
      if (storeName) {
        storeMap.set(storeName, (storeMap.get(storeName) || 0) + 1);
      }
    });
    return Array.from(storeMap.entries())
      .map(([name]) => name)
      .sort();
  }, [allTournaments]);

  const otherStores = allStores.slice(8);

  const handleStoreToggle = (storeName: string) => {
    setSelectedStores((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storeName)) {
        newSet.delete(storeName);
      } else {
        newSet.add(storeName);
      }
      return newSet;
    });
  };

  // Handle "other stores" toggle
  const handleOtherStoresToggle = () => {
    setSelectedStores((prev) => {
      const newSet = new Set(prev);
      const hasOtherSelected = otherStores.some((store) => newSet.has(store));
      
      if (hasOtherSelected) {
        // Remove all other stores
        otherStores.forEach((store) => newSet.delete(store));
      } else {
        // Add all other stores
        otherStores.forEach((store) => newSet.add(store));
      }
      return newSet;
    });
  };

  const handleClearFilter = () => {
    setSelectedStores(new Set());
    setSelectedEventCategories(new Set());
  };

  const handleEventCategoryToggle = (category: EventCategory) => {
    setSelectedEventCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Yu-Gi-Oh! Versenyek Magyarországon</h1>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Versenyek betöltése...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Újra</button>
          </div>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <div className="empty">
            <p>Nem található verseny az aktuális dátumtartományban.</p>
          </div>
        )}

        {!loading && !error && allTournaments.length > 0 && (
          <>
            <EventCategoryFilter
              tournaments={allTournaments}
              selectedCategories={selectedEventCategories}
              onCategoryToggle={handleEventCategoryToggle}
            />
            <StoreFilter
              tournaments={allTournaments}
              selectedStores={selectedStores}
              onStoreToggle={handleStoreToggle}
              onOtherStoresToggle={handleOtherStoresToggle}
              onClearFilter={handleClearFilter}
            />
            <div className="tournaments-count">
              {tournaments.length} verseny található
              {(selectedStores.size > 0 || selectedEventCategories.size > 0) && ` (${allTournaments.length} összesen)`}
            </div>
            <div className="tournaments-list">
              {tournaments.length > 0 ? (
                (() => {
                  const groupedByWeek = groupTournamentsByWeek(tournaments);
                  const result: JSX.Element[] = [];
                  
                  groupedByWeek.forEach((weekTournaments, weekKey) => {
                    const firstTournament = weekTournaments[0];
                    const weekInfo = getWeekInfo(firstTournament.localTournamentDate);
                    const isCurrent = isCurrentWeek(weekInfo.week, weekInfo.year);
                    
                    result.push(
                      <div key={weekKey} className="week-section">
                        {!isCurrent && (
                          <div className="week-header">
                            <span className="week-label">{weekInfo.display}</span>
                          </div>
                        )}
                        {weekTournaments.map((tournament) => (
                          <TournamentCard key={tournament.tournamentNo} tournament={tournament} />
                        ))}
                      </div>
                    );
                  });
                  
                  return result;
                })()
              ) : (
                <div className="empty">
                  <p>Nincs verseny a kiválasztott szűrőkhöz.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <div className="author-info">
            <span className="author-name">Szerémi Attila</span>
            <span className="author-nickname">(amcsi)</span>
          </div>
          <a
            href="https://github.com/amcsi/yugioh-tournaments"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            aria-label="GitHub repository"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
