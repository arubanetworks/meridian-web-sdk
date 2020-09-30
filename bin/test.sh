#!/usr/bin/env bash
set -eu

npx eslint "{src,cypress}/**/*.js"
npx prettier --check "{src,cypress}/**/*.js"
