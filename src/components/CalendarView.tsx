import { useState, useMemo } from "react";
import type { Tournament } from "../types/tournament";
import { TournamentCard } from "./TournamentCard";
import { useLanguage } from "../contexts/LanguageContext";
import { getEventCategory, getEventCategoryColor, getEventCategoryLabel, type EventCategory } from "../utils/eventCategory";
import "./CalendarView.css";

interface CalendarViewProps {
  tournaments: Tournament[];
}

export function CalendarView({ tournaments }: CalendarViewProps) {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Group tournaments by date
  const tournamentsByDate = useMemo(() => {
    const grouped = new Map<string, Tournament[]>();
    
    tournaments.forEach((tournament) => {
      try {
        // Parse date string "2026/01/15 15:00"
        const [datePart] = tournament.localTournamentDate.split(" ");
        const [year, month, day] = datePart.split("/").map(Number);
        const date = new Date(year, month - 1, day);
        const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
        
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(tournament);
      } catch (error) {
        // Skip invalid dates
      }
    });
    
    return grouped;
  }, [tournaments]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Monday (ISO week)
    const startDay = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    const daysInMonth = lastDay.getDate();
    
    const days: Array<{ date: Date; isCurrentMonth: boolean; categoryCounts: Map<EventCategory, number> }> = [];
    
    // Helper function to count tournaments by category
    const getCategoryCounts = (dateKey: string): Map<EventCategory, number> => {
      const tournaments = tournamentsByDate.get(dateKey) || [];
      const counts = new Map<EventCategory, number>();
      tournaments.forEach((tournament) => {
        const category = getEventCategory(tournament);
        counts.set(category, (counts.get(category) || 0) + 1);
      });
      return counts;
    };
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        isCurrentMonth: false,
        categoryCounts: getCategoryCounts(dateKey),
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        isCurrentMonth: true,
        categoryCounts: getCategoryCounts(dateKey),
      });
    }
    
    // Next month days to fill the week
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateKey = date.toISOString().split("T")[0];
      days.push({
        date,
        isCurrentMonth: false,
        categoryCounts: getCategoryCounts(dateKey),
      });
    }
    
    return days;
  }, [currentDate, tournamentsByDate]);

  const monthNames = language === "hu"
    ? ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const weekDayNames = language === "hu"
    ? ["H", "K", "Sz", "Cs", "P", "Sz", "V"]
    : ["M", "T", "W", "T", "F", "S", "S"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const selectedDateKey = selectedDate?.toISOString().split("T")[0];
  const selectedTournaments = selectedDateKey ? tournamentsByDate.get(selectedDateKey) || [] : [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === "hu" ? "hu-HU" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="calendar-view">
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="calendar-nav-button" onClick={() => navigateMonth("prev")}>
            ←
          </button>
          <h2 className="calendar-month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button className="calendar-nav-button" onClick={() => navigateMonth("next")}>
            →
          </button>
        </div>
        <button className="calendar-today-button" onClick={goToToday}>
          {language === "hu" ? "Mai nap" : "Today"}
        </button>
        
        <div className="calendar-grid">
          {/* Week day headers */}
          {weekDayNames.map((day, index) => (
            <div key={index} className="calendar-weekday">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((dayInfo, index) => {
            const dateKey = dayInfo.date.toISOString().split("T")[0];
            const isSelected = selectedDateKey === dateKey;
            const isToday = dateKey === new Date().toISOString().split("T")[0];
            const isHovered = hoveredDate?.toISOString().split("T")[0] === dateKey;
            // Check if it's a weekend (Saturday = 5, Sunday = 6 in the grid, since we start with Monday)
            const dayOfWeek = dayInfo.date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
            const dayTournaments = tournamentsByDate.get(dateKey) || [];
            
            return (
              <div key={index} className="calendar-day-wrapper">
                <button
                  className={`calendar-day ${!dayInfo.isCurrentMonth ? "other-month" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${isWeekend ? "weekend" : ""}`}
                  onClick={() => {
                    if (dayInfo.isCurrentMonth) {
                      setSelectedDate(dayInfo.date);
                    }
                  }}
                  onMouseEnter={() => {
                    if (dayInfo.isCurrentMonth && dayTournaments.length > 0) {
                      setHoveredDate(dayInfo.date);
                    }
                  }}
                  onMouseLeave={() => setHoveredDate(null)}
                  disabled={!dayInfo.isCurrentMonth}
                >
                  <span className="calendar-day-number">{dayInfo.date.getDate()}</span>
                  {dayInfo.categoryCounts.size > 0 && (
                    <div className="calendar-day-badges">
                      {Array.from(dayInfo.categoryCounts.entries()).map(([category, count]) => (
                        <span
                          key={category}
                          className="calendar-day-badge"
                          style={{ backgroundColor: getEventCategoryColor(category) }}
                        >
                          {count}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
                {isHovered && dayTournaments.length > 0 && (
                  <div className="calendar-day-tooltip">
                    <div className="tooltip-content">
                      <div className="tooltip-header">
                        {formatDate(dayInfo.date)} ({dayTournaments.length})
                      </div>
                      <div className="tooltip-tournaments">
                        {dayTournaments.slice(0, 5).map((tournament) => {
                          const category = getEventCategory(tournament);
                          const categoryColor = getEventCategoryColor(category);
                          const categoryLabel = getEventCategoryLabel(category, language);
                          return (
                            <div key={tournament.tournamentNo} className="tooltip-tournament">
                              <div className="tooltip-tournament-header">
                                <div className="tooltip-tournament-name">{tournament.tournamentName}</div>
                                <span
                                  className="tooltip-tournament-badge"
                                  style={{ backgroundColor: categoryColor }}
                                  title={categoryLabel}
                                >
                                  {categoryLabel}
                                </span>
                              </div>
                              <div className="tooltip-tournament-time">
                                {tournament.localTournamentDate.split(" ")[1] || ""}
                              </div>
                              <div className="tooltip-tournament-location">{tournament.locationName}</div>
                            </div>
                          );
                        })}
                        {dayTournaments.length > 5 && (
                          <div className="tooltip-more">
                            {language === "hu" ? `+${dayTournaments.length - 5} további` : `+${dayTournaments.length - 5} more`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="calendar-selected-date">
          <h3 className="selected-date-title">
            {formatDate(selectedDate)}
            {selectedTournaments.length > 0 && (
              <span className="selected-date-count"> ({selectedTournaments.length})</span>
            )}
          </h3>
          {selectedTournaments.length > 0 ? (
            <div className="selected-date-tournaments">
              {selectedTournaments.map((tournament) => (
                <TournamentCard key={tournament.tournamentNo} tournament={tournament} />
              ))}
            </div>
          ) : (
            <div className="selected-date-empty">
              <p>{language === "hu" ? "Nincs verseny ezen a napon." : "No tournaments on this date."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
