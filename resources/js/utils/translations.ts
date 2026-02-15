export type Language = "hu" | "en";

export interface Translations {
  // App header
  appTitle: string;
  
  // Loading and errors
  loading: string;
  errorRetry: string;
  noTournaments: string;
  noTournamentsFiltered: string;
  
  // Tournament count
  tournamentsFound: string;
  tournamentsTotal: string;
  
  // Filters
  filterByStore: string;
  filterByEventType: string;
  otherStores: string;
  clearFilter: string;
  
  // Store types
  storeTypeMetagame: string;
  storeTypeRemetebarlang: string;
  storeTypeSasKos: string;
  storeTypePottyosZebra: string;
  storeTypeSportKartya: string;
  storeTypeBoL: string;
  storeTypeJatekCeh: string;
  storeTypeRatmayer: string;
  storeTypeOther: string;
  
  // Tournament card labels
  eventType: string;
  structure: string;
  dateAndTime: string;
  entry: string;
  location: string;
  address: string;
  phone: string;
  players: string;
  registered: string;
  reservations: string;
  reservationsAvailable: string;
  noReservations: string;
  spotsAvailable: string;
  moreInformation: string;
  
  // Structure types
  freePlay: string;
  swissDraw: string;
  singleElimination: string;
  
  // Week
  week: string;
  
  // Event categories
  categoryLocal: string;
  categoryOTS: string;
  categoryRegional: string;
  categoryNational: string;
  categoryFreePlay: string;
  
  // Footer
  authorName: string;
  authorNickname: string;
  
  // Calendar view
  today: string;
  noTournamentsOnDate: string;
  noTournamentsWithFilters: string;
  tooltipMoreTournaments: string;
  
  // Filters
  showFilters: string;
  hideFilters: string;
  
  // View modes
  calendarToggle: string;
  
  // Error messages
  failedToLoadTournaments: string;
}

export const translations: Record<Language, Translations> = {
  hu: {
    appTitle: "Yu-Gi-Oh! Versenyek Magyarországon",
    loading: "Versenyek betöltése...",
    errorRetry: "Újra",
    noTournaments: "Nem található verseny az aktuális dátumtartományban.",
    noTournamentsFiltered: "Nincs verseny a kiválasztott szűrőkhöz.",
    tournamentsFound: "verseny található",
    tournamentsTotal: "összesen",
    filterByStore: "Szűrés bolt szerint",
    filterByEventType: "Szűrés esemény típus szerint",
    otherStores: "Egyéb boltok",
    clearFilter: "Szűrés törlése",
    storeTypeMetagame: "Metagame",
    storeTypeRemetebarlang: "Remetebarlang",
    storeTypeSasKos: "SAS és KOS",
    storeTypePottyosZebra: "Pöttyös Zebra",
    storeTypeSportKartya: "Sport Kártya",
    storeTypeBoL: "BoL",
    storeTypeJatekCeh: "Játék Céh",
    storeTypeRatmayer: "Ratmayer",
    storeTypeOther: "Egyéb",
    eventType: "Esemény típusa:",
    structure: "Rendszer:",
    dateAndTime: "Dátum és idő:",
    entry: "Jelentkezés:",
    location: "Helyszín:",
    address: "Cím:",
    phone: "Telefon:",
    players: "Játékosok:",
    registered: "bejelentkezve",
    reservations: "Foglalások:",
    reservationsAvailable: "Foglalás lehetséges",
    noReservations: "Nincs foglalás",
    spotsAvailable: "hely elérhető",
    moreInformation: "További információ",
    freePlay: "Szabad játék",
    swissDraw: "Svájci rendszer",
    singleElimination: "Egyenes kiesés",
    week: "hét",
    categoryLocal: "Local",
    categoryOTS: "OTSC",
    categoryRegional: "Regional",
    categoryNational: "Nemzeti",
    categoryFreePlay: "Szabad Játék",
    authorName: "Szerémi Attila",
    authorNickname: "(amcsi)",
    today: "Mai nap",
    noTournamentsOnDate: "Nincs verseny ezen a napon.",
    noTournamentsWithFilters: "Nincs verseny a kiválasztott szűrőkkel.",
    tooltipMoreTournaments: "további",
    calendarToggle: "Naptár",
    failedToLoadTournaments: "Nem sikerült betölteni a versenyeket",
    showFilters: "Szűrők",
    hideFilters: "Szűrők elrejtése",
  },
  en: {
    appTitle: "Yu-Gi-Oh! Tournaments in Hungary",
    loading: "Loading tournaments...",
    errorRetry: "Retry",
    noTournaments: "No tournaments found for the current date range.",
    noTournamentsFiltered: "No tournaments match the selected filters.",
    tournamentsFound: "tournaments found",
    tournamentsTotal: "total",
    filterByStore: "Filter by store",
    filterByEventType: "Filter by event type",
    otherStores: "Other stores",
    clearFilter: "Clear filter",
    storeTypeMetagame: "Metagame",
    storeTypeRemetebarlang: "Remetebarlang",
    storeTypeSasKos: "SAS és KOS",
    storeTypePottyosZebra: "Pöttyös Zebra",
    storeTypeSportKartya: "Sport Kártya",
    storeTypeBoL: "BoL",
    storeTypeJatekCeh: "Játék Céh",
    storeTypeRatmayer: "Ratmayer",
    storeTypeOther: "Other",
    eventType: "Event Type:",
    structure: "Structure:",
    dateAndTime: "Date & Time:",
    entry: "Entry:",
    location: "Location:",
    address: "Address:",
    phone: "Phone:",
    players: "Players:",
    registered: "registered",
    reservations: "Reservations:",
    reservationsAvailable: "Reservations Available",
    noReservations: "No Reservations",
    spotsAvailable: "spots available",
    moreInformation: "More Information",
    freePlay: "Free Play",
    swissDraw: "Swiss Draw",
    singleElimination: "Single Elimination",
    week: "week",
    categoryLocal: "Local",
    categoryOTS: "OTSC",
    categoryRegional: "Regional",
    categoryNational: "National",
    categoryFreePlay: "Free Play",
    authorName: "Szerémi Attila",
    authorNickname: "(amcsi)",
    today: "Today",
    noTournamentsOnDate: "No tournaments on this date.",
    noTournamentsWithFilters: "No tournaments match the selected filters.",
    tooltipMoreTournaments: "more",
    calendarToggle: "Calendar",
    failedToLoadTournaments: "Failed to load tournaments",
    showFilters: "Filters",
    hideFilters: "Hide filters",
  },
};

export function detectLanguage(): Language {
  // Check localStorage first
  const saved = localStorage.getItem("language") as Language | null;
  if (saved && (saved === "hu" || saved === "en")) {
    return saved;
  }
  
  // Check user-agent
  const lang = navigator.language || (navigator as any).userLanguage || "en";
  if (lang.startsWith("hu")) {
    return "hu";
  }
  
  return "en";
}

export function saveLanguage(language: Language): void {
  localStorage.setItem("language", language);
}
