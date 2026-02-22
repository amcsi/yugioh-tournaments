<?php

use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/tournaments', function (Request $request) {
    $path = 'public/tournaments.json';

    if (! Storage::exists($path)) {
        return response()->json(['error' => 'Tournaments data not available. Run php artisan tournaments:fetch.'], 404);
    }

    $ifModifiedSince = $request->headers->get('If-Modified-Since');

    $lastModified = Storage::lastModified($path);
    if ($ifModifiedSince && $lastModified === new CarbonImmutable($ifModifiedSince)->getTimestamp()) {
        return response('')->setNotModified();
    }

    return Storage::response($path)->setLastModified(CarbonImmutable::createFromTimestamp($lastModified));
});
