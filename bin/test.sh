#!/usr/bin/env bash
set -eux

npx eslint "src/**/*.js"
npx prettier --list-different "src/**/*.js"
