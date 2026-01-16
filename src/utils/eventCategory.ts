import type { Tournament } from "../types/tournament";

export type EventCategory = "Local" | "OTS" | "Regional" | "Nemzeti" | "Szabad Játék";

export function getEventCategory(tournament: Tournament): EventCategory {
  const eventName = tournament.eventName.toLowerCase();
  const eventUrl = tournament.eventUrl?.toLowerCase() || "";

  // Check for Open Dueling (Szabad Játék)
  if (eventName.includes("open dueling")) {
    return "Szabad Játék";
  }

  // Check for Regional events by URL first
  if (eventUrl.includes("opens") || eventUrl === "https://www.yugioh-card.com/eu/event-category/opens/") {
    return "Regional";
  }

  // Check for Regional events by name
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
      return "#a855f7"; // Purple
    case "Regional":
      return "#f59e0b"; // Amber/Orange
    case "Nemzeti":
      return "#ef4444"; // Red
    case "Szabad Játék":
      return "#10b981"; // Green
    default:
      return "#6b7280"; // Gray
  }
}

export function getEventCategoryLabel(category: EventCategory): string {
  return category;
}
