import { useState, useEffect } from "react";
import { searchTournaments, createTournamentSearchRequest } from "./services/tournamentApi";
import type { Tournament } from "./types/tournament";
import { TournamentCard } from "./components/TournamentCard";
import "./App.css";

function App() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        setLoading(true);
        setError(null);
        const request = createTournamentSearchRequest();
        const response = await searchTournaments(request);
        setTournaments(response.result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nem sikerült betölteni a versenyeket");
        console.error("Error fetching tournaments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTournaments();
  }, []);

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

        {!loading && !error && tournaments.length > 0 && (
          <>
            <div className="tournaments-count">
              {tournaments.length} verseny található
            </div>
            <div className="tournaments-list">
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament.tournamentNo} tournament={tournament} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
