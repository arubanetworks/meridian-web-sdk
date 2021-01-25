#!/usr/bin/env bash
set -eux

rm -rf dist docs
mkdir -p dist docs
npx webpack -p --mode production --env production
npm run docs
mkdir "$npm_package_version"
mv dist/* "$npm_package_version"
mv "$npm_package_version" dist
