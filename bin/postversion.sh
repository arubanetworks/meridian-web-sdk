#!/usr/bin/env bash
set -eu

git push
git push --tags
npm publish --access=public
