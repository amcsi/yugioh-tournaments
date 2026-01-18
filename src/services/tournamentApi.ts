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
  // Use cors-anywhere.com as CORS proxy
  const proxyUrl = `${CORS_PROXY}${API_URL}`;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
        const status = err.response?.status;
        const errorMessage = err.response?.data
          ? String(err.response.data)
          : err.message;

        // Only retry on 500 errors or network errors
        const isRetryable = status === 500 || status === undefined;

        if (isRetryable && attempt < maxRetries) {
          // Wait before retrying (exponential backoff: 1s, 2s, 4s)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
          await new Promise((resolve) => setTimeout(resolve, delay));
          lastError = new Error(
            `Nem sikerült betölteni a versenyeket: ${status || "Hálózati hiba"} ${errorMessage}`,
          );
          continue;
        }

        // Not retryable or max retries reached
        throw new Error(
          `Nem sikerült betölteni a versenyeket: ${status || "Ismeretlen"} ${errorMessage}`,
        );
      }

      if (err instanceof Error) {
        // For non-axios errors, retry if we haven't reached max retries
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 4000);
          await new Promise((resolve) => setTimeout(resolve, delay));
          lastError = err;
          continue;
        }
        throw err;
      }

      lastError = new Error("Ismeretlen hiba történt a versenyek betöltése során");
    }
  }

  // If we've exhausted all retries, throw the last error
  throw lastError || new Error("Ismeretlen hiba történt a versenyek betöltése során");
}

export function createTournamentSearchRequest(): TournamentSearchRequest {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  // Set webOpenDate to yesterday at 23:00 local time
  const webOpenDate = new Date(startDate);
  webOpenDate.setDate(webOpenDate.getDate() - 1);
  webOpenDate.setHours(23, 0, 0, 0);

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
