#!/usr/bin/env bash
set -eu

npx eslint "src/**/*.js"
npx prettier --check "src/**/*.js"
