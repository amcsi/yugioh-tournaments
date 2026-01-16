import type { Tournament } from "../types/tournament";
import { getEventCategory, getEventCategoryColor, type EventCategory } from "../utils/eventCategory";
import "./EventCategoryFilter.css";

interface EventCategoryFilterProps {
  tournaments: Tournament[];
  selectedCategories: Set<EventCategory>;
  onCategoryToggle: (category: EventCategory) => void;
}

export function EventCategoryFilter({
  tournaments,
  selectedCategories,
  onCategoryToggle,
}: EventCategoryFilterProps) {
  // Count tournaments per category
  const categoryCounts = new Map<EventCategory, number>();
  
  tournaments.forEach((tournament) => {
    const category = getEventCategory(tournament);
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  });

  const categories: EventCategory[] = ["Szabad Játék", "Local", "OTS", "Regional", "Nemzeti"];

  return (
    <div className="event-category-filter">
      <h3 className="filter-title">Szűrés esemény típus szerint</h3>
      <div className="category-buttons">
        {categories.map((category) => {
          const count = categoryCounts.get(category) || 0;
          const color = getEventCategoryColor(category);
          const isSelected = selectedCategories.has(category);

          return (
            <button
              key={category}
              className={`category-button ${isSelected ? "active" : ""} ${count === 0 ? "disabled" : ""}`}
              onClick={() => onCategoryToggle(category)}
              disabled={count === 0}
              style={{
                borderColor: isSelected ? color : "rgba(255, 255, 255, 0.1)",
                backgroundColor: isSelected ? `${color}20` : "rgba(255, 255, 255, 0.05)",
                opacity: count === 0 ? 0.5 : 1,
              }}
            >
              <span
                className="category-badge"
                style={{ backgroundColor: color }}
              >
                {category}
              </span>
              <span className="category-count">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
