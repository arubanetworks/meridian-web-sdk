#!/bin/bash
#
# -e causes failing commands to error
# -u causes undefined variables without fallback values to error
#
set -eu

die() {
  echo "$@" >&2
  exit 1
}

echo "Verifying you are logged into gcloud..."
if ! gcloud auth list 2>&1 |  grep 'ACTIVE'; then
  die "You are NOT logged into gcloud. Please run: gcloud auth login"
fi

# `npm run` provides this environment variable so we don't have to parse the
# package.json just to get the version number
version=${VERSION:-$npm_package_version}
name="meridian-sdk-demo"
bucket="gs://${name}/__SECRET__/$version"

echo
echo "--- Deploying ${name} demos ${version} ---"
echo

echo "* Building SDK JS bundle..."
npm run -s build
mv dist/meridian-sdk.js demo

echo "* Copying build files..."
gsutil -m cp -r demo/* "$bucket/"

echo "* Cleaning up build files..."
rm demo/meridian-sdk.js

echo
echo "--- Deployed ${name} demos ${version} ---"
