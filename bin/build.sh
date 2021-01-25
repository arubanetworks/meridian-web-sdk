#!/usr/bin/env bash
set -eux

rm -rf dist docs gcs-files
mkdir -p dist docs gcs-files
npx webpack -p --mode production --env production
npm run docs
dir="$npm_package_version"
mkdir -p "$dir"
cp dist/* "$dir"
mv "$dir" gcs-files
