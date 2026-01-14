import type { Tournament } from "../types/tournament";
import "./TournamentCard.css";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    // Date format is "2026/01/15 15:00"
    return dateString.replace(" ", " at ");
  };

  const getStructureLabel = (structure: string) => {
    switch (structure) {
      case "FREE":
        return "Free Play";
      case "SWISSDRAW":
        return "Swiss Draw";
      case "SINGLE_ELIMINATION":
        return "Single Elimination";
      default:
        return structure;
    }
  };

  const getReserveStateLabel = (state: string) => {
    return state === "RESERVEABLE" ? "Reservations Available" : "No Reservations";
  };

  return (
    <div className="tournament-card">
      <div className="tournament-header">
        <h3 className="tournament-name">{tournament.tournamentName}</h3>
        <span className="tournament-number">{tournament.tournamentNo}</span>
      </div>

      <div className="tournament-info">
        <div className="info-row">
          <span className="info-label">Event Type:</span>
          <span className="info-value">{tournament.eventName}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Structure:</span>
          <span className="info-value">{getStructureLabel(tournament.structure)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Date & Time:</span>
          <span className="info-value">
            {formatDate(tournament.localTournamentDate)}
            {tournament.localTournamentDateEnd && ` - ${formatDate(tournament.localTournamentDateEnd)}`}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Entry:</span>
          <span className="info-value">
            {formatDate(tournament.localEntryStartDate)} - {formatDate(tournament.localEntryEndDate)}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Location:</span>
          <span className="info-value">{tournament.locationName}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Address:</span>
          <span className="info-value">{tournament.address}</span>
        </div>

        {tournament.location.telNo && (
          <div className="info-row">
            <span className="info-label">Phone:</span>
            <span className="info-value">{tournament.location.telNo}</span>
          </div>
        )}

        <div className="info-row">
          <span className="info-label">Players:</span>
          <span className="info-value">
            {tournament.localPlayerNumber} / {tournament.forecastPlayerNumber} registered
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Reservations:</span>
          <span className={`info-value ${tournament.reserveState === "RESERVEABLE" ? "reservable" : ""}`}>
            {getReserveStateLabel(tournament.reserveState)}
            {tournament.reserveState === "RESERVEABLE" && tournament.restReservePlayerNumber > 0 && (
              <span> ({tournament.restReservePlayerNumber} spots available)</span>
            )}
          </span>
        </div>

        {tournament.eventUrl && (
          <div className="info-row">
            <a
              href={tournament.eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="event-link"
            >
              More Information →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
