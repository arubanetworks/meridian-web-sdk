#!/usr/bin/env bash
set -eux

rm -rf docs
typedoc
mkdir -p docs/examples
cp -r demo/* docs/examples
# Turn off Jekyll processing, which deletes files made by TypeDoc, since they
# start with underscores, which Jekyll ignores.
# https://github.com/jekyll/jekyll/issues/55#issuecomment-97878
touch docs/.nojekyll
cp dist/meridian-sdk.js docs/examples
