#!/usr/bin/env bash
set -eu

set -x
npx eslint "src/**/*.js"
npx prettier --list-different "src/**/*.js"
