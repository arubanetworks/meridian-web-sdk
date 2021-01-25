#!/usr/bin/env bash
set -eux

rm -rf dist docs
mkdir -p dist docs
npx webpack -p --mode production --env production
npm run docs
dir="meridian-web-sdk/$npm_package_version"
mkdir -p "$dir"
mv dist/* "$dir"
mv "$dir" dist
