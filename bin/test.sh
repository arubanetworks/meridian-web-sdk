#!/usr/bin/env bash
set -eu

npx eslint "{src,cypress}/**/*.{js,ts,tsx}"
npx prettier --check "{src,cypress}/**/*.{js,ts,tsx}"
