import type { Tournament } from "../types/tournament";
import { getEventCategory, getEventCategoryColor, type EventCategory } from "../utils/eventCategory";
import "./TournamentCard.css";

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    // Date format is "2026/01/15 15:00"
    return dateString.replace(" ", " - ");
  };

  const formatDateWithDay = (dateString: string) => {
    if (!dateString) return "N/A";
    
    try {
      // Parse the date string "2026/01/15 15:00"
      const [datePart, timePart] = dateString.split(" ");
      const [year, month, day] = datePart.split("/").map(Number);
      
      // Create a date object (month is 0-indexed in JavaScript Date)
      const date = new Date(year, month - 1, day);
      
      // Get day of week in Hungarian
      const dayNames = ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"];
      const dayName = dayNames[date.getDay()];
      
      // Format: "2026/01/15 (szerda) - 15:00"
      if (timePart) {
        return `${datePart} (${dayName}) - ${timePart}`;
      }
      return `${datePart} (${dayName})`;
    } catch (error) {
      // Fallback to original format if parsing fails
      return formatDate(dateString);
    }
  };

  const getStructureLabel = (structure: string) => {
    switch (structure) {
      case "FREE":
        return "Szabad játék";
      case "SWISSDRAW":
        return "Svájci rendszer";
      case "SINGLE_ELIMINATION":
        return "Egyenes kiesés";
      default:
        return structure;
    }
  };

  const getReserveStateLabel = (state: string) => {
    return state === "RESERVEABLE" ? "Foglalás lehetséges" : "Nincs foglalás";
  };

  const getStoreType = (storeName: string): string => {
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
  };

  const storeType = getStoreType(tournament.storeName || tournament.locationName);
  const eventCategory = getEventCategory(tournament);
  const eventCategoryColor = getEventCategoryColor(eventCategory);

  return (
    <div className="tournament-card">
      <div className="tournament-header">
        <div className="tournament-header-left">
          <h3 className="tournament-name">{tournament.tournamentName}</h3>
          <span
            className="event-category-badge"
            style={{ backgroundColor: eventCategoryColor }}
          >
            {eventCategory}
          </span>
        </div>
        <div className="tournament-header-right">
          <span className="store-type-badge">{storeType}</span>
          <span className="tournament-number">{tournament.tournamentNo}</span>
        </div>
      </div>

      <div className="tournament-info">
        <div className="info-row">
          <span className="info-label">Esemény típusa:</span>
          <span className="info-value">{tournament.eventName}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Rendszer:</span>
          <span className="info-value">{getStructureLabel(tournament.structure)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Dátum és idő:</span>
          <span className="info-value">
            {formatDateWithDay(tournament.localTournamentDate)}
            {tournament.localTournamentDateEnd && ` - ${formatDateWithDay(tournament.localTournamentDateEnd)}`}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Jelentkezés:</span>
          <span className="info-value">
            {formatDate(tournament.localEntryStartDate)} - {formatDate(tournament.localEntryEndDate)}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Helyszín:</span>
          <span className="info-value">{tournament.locationName}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Cím:</span>
          <span className="info-value">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tournament.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="address-link"
            >
              {tournament.address}
            </a>
          </span>
        </div>

        {tournament.location.telNo && (
          <div className="info-row">
            <span className="info-label">Telefon:</span>
            <span className="info-value">{tournament.location.telNo}</span>
          </div>
        )}

        <div className="info-row">
          <span className="info-label">Játékosok:</span>
          <span className="info-value">
            {tournament.localPlayerNumber} / {tournament.forecastPlayerNumber} bejelentkezve
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Foglalások:</span>
          <span className={`info-value ${tournament.reserveState === "RESERVEABLE" ? "reservable" : ""}`}>
            {getReserveStateLabel(tournament.reserveState)}
            {tournament.reserveState === "RESERVEABLE" && tournament.restReservePlayerNumber > 0 && (
              <span> ({tournament.restReservePlayerNumber} hely elérhető)</span>
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
              További információ →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
