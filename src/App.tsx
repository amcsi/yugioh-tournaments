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
        setError(err instanceof Error ? err.message : "Failed to load tournaments");
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
        <h1>Yu-Gi-Oh! Tournaments in Hungary</h1>
        <p className="subtitle">Find the latest tournament events near you</p>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading tournaments...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <div className="empty">
            <p>No tournaments found for the current date range.</p>
          </div>
        )}

        {!loading && !error && tournaments.length > 0 && (
          <>
            <div className="tournaments-count">
              Found {tournaments.length} tournament{tournaments.length !== 1 ? "s" : ""}
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
