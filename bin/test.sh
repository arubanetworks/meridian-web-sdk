#!/usr/bin/env bash
set -eu

npx eslint "{src,cypress}/**/*.+(js|ts)"
npx prettier --check "{src,cypress}/**/*.+(js|ts)"
