import type { Tournament } from "../types/tournament";

export type EventCategory = "Local" | "OTS" | "Regional" | "Nemzeti";

export function getEventCategory(tournament: Tournament): EventCategory {
  const eventName = tournament.eventName.toLowerCase();

  // Check for Regional events
  if (eventName.includes("regional")) {
    return "Regional";
  }

  // Check for National events
  if (eventName.includes("national") || eventName.includes("nemzeti")) {
    return "Nemzeti";
  }

  // Check for OTS (Official Tournament Store)
  if (eventName.includes("ots")) {
    return "OTS";
  }

  // Default to Local
  return "Local";
}

export function getEventCategoryColor(category: EventCategory): string {
  switch (category) {
    case "Local":
      return "#3b82f6"; // Blue
    case "OTS":
      return "#10b981"; // Green
    case "Regional":
      return "#f59e0b"; // Amber/Orange
    case "Nemzeti":
      return "#ef4444"; // Red
    default:
      return "#6b7280"; // Gray
  }
}

export function getEventCategoryLabel(category: EventCategory): string {
  return category;
}
