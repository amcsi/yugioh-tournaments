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

        $path = Storage::disk('public')->path(self::STORAGE_FILE);
        $dir = dirname($path);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $written = file_put_contents($path, json_encode($json, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        if ($written === false) {
            $this->error('Failed to write ' . $path);

            return self::FAILURE;
        }

        $count = (int) ($json['count'] ?? count($json['result'] ?? []));
        $this->info("Saved {$count} tournaments to storage (" . self::STORAGE_FILE . ').');

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
