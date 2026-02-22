<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class FetchTournamentsCommand extends Command
{
    protected $signature = 'app:fetch-tournaments';

    protected $description = 'Fetch tournaments from Konami API and save JSON to public storage';

    private const KONAMI_URL = 'https://cardgame-network.konami.net/mt/user/rest/tournament/EU/tournament_gsearch';

    private const STORAGE_FILE = 'tournaments.json';

    public function handle(): int
    {
        $body = $this->buildRequest();

        $this->info('Calling Konami API…');

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json, text/plain, */*',
        ])->timeout(30)->post(self::KONAMI_URL, $body);

        if (! $response->successful()) {
            $this->error('Konami API error: ' . $response->status() . ' ' . $response->body());

            return self::FAILURE;
        }

        $json = $response->json();
        if ($json === null) {
            $this->error('Invalid JSON response from Konami API');

            return self::FAILURE;
        }

        $content = json_encode($json, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        Storage::disk('public')->put(self::STORAGE_FILE, $content);

        $count = (int) ($json['count'] ?? count($json['result'] ?? []));
        $this->info('Saved ' . $count . ' tournaments to storage/app/public/' . self::STORAGE_FILE . '.');

        return self::SUCCESS;
    }

    private function buildRequest(): array
    {
        $now = new \DateTimeImmutable('now');
        $startDate = $now->setTime(0, 0, 0, 0);
        $webOpenDate = $startDate->modify('-1 day')->setTime(23, 0, 0, 0);

        return [
            'keyword' => '',
            'nationCodes' => ['HU'],
            'stateCodes' => null,
            'sDate' => $now->format(\DateTimeInterface::ATOM),
            'startDate' => $startDate->format(\DateTimeInterface::ATOM),
            'eDate' => null,
            'endDate' => null,
            'startTime' => null,
            'startTimeSelect' => null,
            'endTime' => null,
            'endTimeSelect' => null,
            'startSeats' => null,
            'eventType' => null,
            'structure' => null,
            'reserveable' => false,
            'gpsSearch' => false,
            'gpsRange' => '10000',
            'latitude' => null,
            'longitude' => null,
            'ageLimits' => null,
            'webOpenDate' => $webOpenDate->format(\DateTimeInterface::ATOM),
            'indexStart' => 0,
            'indexCount' => 50,
            'eventGrpId' => 0,
        ];
    }
}
