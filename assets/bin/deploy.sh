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

bucket="gs://${npm_package_name}"

echo "Verifying you are logged into gcloud..."
if ! gcloud auth list 2>&1 |  grep 'ACTIVE'; then
  die "You are NOT logged into gcloud. Please run: gcloud auth login"
fi

# `npm run` provides this environment variable so we don't have to parse the
# package.json just to get the version number
version=${VERSION:-$npm_package_version}

echo
echo "--- Deploying ${npm_package_name} ${version} ---"
echo

echo "* Copying build files..."
gsutil -m cp -r placemarks "$bucket/$version/"

echo
echo "--- Deployed ${npm_package_name} ${version} ---"
