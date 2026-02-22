<?php

use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/tournaments', function (Request $request) {
    $path = 'tournaments.json';
    $storage = Storage::disk('public');

    if (! $storage->exists($path)) {
        return response()->json(['error' => 'Tournaments data not available. Run php artisan tournaments:fetch.'], 404);
    }

    $ifModifiedSince = $request->headers->get('If-Modified-Since');

    $lastModified = $storage->lastModified($path);
    if ($ifModifiedSince && $lastModified === new CarbonImmutable($ifModifiedSince)->getTimestamp()) {
        return response('')->setNotModified();
    }

    return $storage->response($path)->setLastModified(CarbonImmutable::createFromTimestamp($lastModified));
});
