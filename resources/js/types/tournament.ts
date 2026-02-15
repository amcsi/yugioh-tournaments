export interface Location {
  locationId: number | null;
  address1: string;
  address2: string;
  address3: string;
  locationName: string;
  nationCode: string;
  postalCode: string;
  telNo: string | null;
  stateCode: string;
  stateName: string;
  latitude: number | null;
  longitude: number | null;
  locationStoreCode: string | null;
}

export interface Tournament {
  longitude: number | null;
  latitude: number | null;
  distance: number;
  reserveState: "DISABLED" | "RESERVEABLE";
  ageLimit: string;
  tournamentNo: string;
  tournamentName: string;
  eventId: number;
  eventName: string;
  eventUrl: string | null;
  structure: "FREE" | "SWISSDRAW" | "SINGLE_ELIMINATION";
  forecastPlayerNumber: number;
  localPlayerNumber: number;
  restReservedAllPlayerNumber: number;
  restReservePlayerNumber: number;
  tournamentDate: number;
  tournamentDateEnd: number | null;
  tournamentStatus: string;
  entryStartTime: number;
  entryStartDate: number;
  entryEndTime: number;
  entryEndDate: number;
  accept: boolean;
  entryOnTheDayStatus: string;
  webEntryCheck: string | null;
  address: string;
  locationName: string;
  storeCode: string;
  storeName: string;
  tel_no: string | null;
  storeAddress: string;
  information: string | null;
  nationCode: string;
  location: Location;
  nationName: string;
  nationIcon: string;
  tournamentOpen: string | null;
  roundMax: number | null;
  reserveLimitFlg: string | null;
  reserveCancelLimitFlg: string;
  userSiteInfo: unknown | null;
  entryName: string | null;
  cossyId: string | null;
  webSiteBean: unknown | null;
  canChangeEntryName: boolean;
  competition: unknown | null;
  localTournamentDate: string;
  localTournamentDateEnd: string;
  localEntryStartDate: string;
  localEntryEndDate: string;
}

export interface TournamentSearchRequest {
  keyword: string;
  nationCodes: string[];
  stateCodes: string[] | null;
  sDate: string;
  startDate: string;
  eDate: string | null;
  endDate: string | null;
  startTime: number | null;
  startTimeSelect: number | null;
  endTime: number | null;
  endTimeSelect: number | null;
  startSeats: number | null;
  eventType: number | null;
  structure: string | null;
  reserveable: boolean;
  gpsSearch: boolean;
  gpsRange: string;
  latitude: number | null;
  longitude: number | null;
  ageLimits: number[] | null;
  webOpenDate: string;
  indexStart: number;
  indexCount: number;
  eventGrpId: number;
}

export interface TournamentSearchResponse {
  result: Tournament[];
  count: number;
}
