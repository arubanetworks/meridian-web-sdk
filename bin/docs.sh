#!/usr/bin/env bash
set -eux

rm -rf docs
typedoc
mkdir -p docs/examples
cp -r demo/* docs/examples
cp dist/meridian-sdk.js docs/examples
