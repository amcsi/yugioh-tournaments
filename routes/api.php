<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/tournaments', function () {
    $path = 'public/tournaments.json';

    if (! Storage::exists($path)) {
        return response()->json(['error' => 'Tournaments data not available. Run php artisan tournaments:fetch.'], 404);
    }

    $json = Storage::get($path);
    $data = json_decode($json, true);

    if ($data === null) {
        return response()->json(['error' => 'Invalid tournaments data.'], 500);
    }

    return response()->json($data)->header('Cache-Control', 'public, max-age=300');
});
