#!/usr/bin/env bash
set -eux

rm -rf dist docs
mkdir -p dist docs
npx webpack -p --mode production --env production
npx typedoc
mkdir -p docs/examples
cp -r demo/* docs/examples
