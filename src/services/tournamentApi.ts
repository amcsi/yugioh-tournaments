import axios from "axios";
import type {
  TournamentSearchRequest,
  TournamentSearchResponse,
} from "../types/tournament";

const API_URL =
  "https://cardgame-network.konami.net/mt/user/rest/tournament/EU/tournament_gsearch";
const CORS_PROXY = "https://cors-anywhere.com/";

export async function searchTournaments(
  request: TournamentSearchRequest,
): Promise<TournamentSearchResponse> {
  // Use cors.lol as CORS proxy
  // cors.lol works by prepending the proxy URL to the target URL
  const proxyUrl = `${CORS_PROXY}${API_URL}`;

  try {
    const response = await axios.post<TournamentSearchResponse>(proxyUrl, request, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
    });

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data
        ? String(err.response.data)
        : err.message;
      throw new Error(
        `Nem sikerült betölteni a versenyeket: ${err.response?.status || "Ismeretlen"} ${errorMessage}`,
      );
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Ismeretlen hiba történt a versenyek betöltése során");
  }
}

export function createTournamentSearchRequest(): TournamentSearchRequest {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  // Set webOpenDate to yesterday at 23:00 UTC (same as sample)
  const webOpenDate = new Date(startDate);
  webOpenDate.setDate(webOpenDate.getDate() - 1);
  webOpenDate.setUTCHours(23, 0, 0, 0);

  return {
    keyword: "",
    nationCodes: ["HU"],
    stateCodes: null,
    sDate: now.toISOString(),
    startDate: startDate.toISOString(),
    eDate: null,
    endDate: null,
    startTime: null,
    startTimeSelect: null,
    endTime: null,
    endTimeSelect: null,
    startSeats: null,
    eventType: null,
    structure: null,
    reserveable: false,
    gpsSearch: false,
    gpsRange: "10000",
    latitude: null,
    longitude: null,
    ageLimits: null,
    webOpenDate: webOpenDate.toISOString(),
    indexStart: 0,
    indexCount: 50,
    eventGrpId: 0,
  };
}
