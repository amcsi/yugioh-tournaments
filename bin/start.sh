#!/bin/bash

mkdir -p storage/framework/{cache,sessions,views} && chmod -R a+rwx $_
mkdir -p storage/app/{private,public} && chmod -R a+rwx $_
mkdir -p storage/logs && chmod -R a+rwx $_

# Run the HTTP server.
apache2-foreground
