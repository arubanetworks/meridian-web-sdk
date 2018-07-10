#!/usr/bin/env bash
set -eu

git push
git push --tags
npm run -s deploy:demo
