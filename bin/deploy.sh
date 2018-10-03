#!/usr/bin/env bash
set -eu

# This script deploys the demos to the GH Pages site and also deploys the
# current version of the SDK to our GCS bucket

bold=$'\e[1m'
cyan=$'\e[36m'
clear=$'\e[0m'

Heading() {
  echo "${clear}"
  echo "${bold}${cyan}$@${clear}"
  echo "${clear}"
}

Die() {
  echo "$@" >&2
  exit 1
}

echo "Verifying you are logged into gcloud..."
if ! gcloud auth list 2>&1 | grep "ACTIVE"; then
  Die "You are NOT logged into gcloud. Please run: gcloud auth login"
fi

bucket="gs://files.meridianapps.com/meridian-web-sdk"

# `npm run` provides this environment variable so we don't have to parse the
# package.json just to get the version number
version="${VERSION:-$npm_package_version}"
name="${npm_package_name}"

Heading "--- Deploying $name demos v$version ---"

Heading "* Cleaning old build..."
rm -rf dist

Heading "* Building SDK JS bundle..."
npm run -s build
cp -r demo/* dist/

Heading "* Copying build files to GCS..."
gsutil -Z \
  -a public-read \
  cp dist/meridian-sdk.js "$bucket/$version/meridian-sdk.js"

Heading "* Deploying examples to GH Pages..."
npx gh-pages --dist dist

Heading "* Cleaning up build files..."
rm -rf dist

Heading "==> https://arubanetworks.github.io/meridian-web-sdk"
