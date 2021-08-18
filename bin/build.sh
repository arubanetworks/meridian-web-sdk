#!/usr/bin/env bash
set -eux

rm -rf dist docs gcs-files
mkdir -p dist docs gcs-files
npx webpack --mode production --env production --config webpack.prod.config.js
npm run docs
dir="$npm_package_version"
mkdir -p "$dir"
cp -r dist/* "$dir"
mv "$dir" gcs-files
