#!/usr/bin/env bash
set -eux

rm -rf dist docs
mkdir -p dist docs
npx webpack -p --mode production --env production
npm run docs
