import type {
  TournamentSearchRequest,
  TournamentSearchResponse,
} from "../types/tournament";

const API_URL =
  "https://cardgame-network.konami.net/mt/user/rest/tournament/EU/tournament_gsearch";

export async function searchTournaments(
  request: TournamentSearchRequest,
): Promise<TournamentSearchResponse> {
  // Make direct request to the API
  const requestBody = JSON.stringify(request);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch tournaments: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Unknown error occurred while fetching tournaments");
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
