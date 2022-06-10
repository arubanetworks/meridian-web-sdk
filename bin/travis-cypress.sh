#!/usr/bin/env bash
set -eu

# Start webpack-dev-server in the background
npm start >/dev/null 2>&1 &

# Store its PID
pid="$!"

# Wait for it to start
# wait-on "http://localhost:3011"

# Run Cypress
# npx cypress run --quiet --headless --browser chrome
npm start-server-and-test start http://localhost:3030 cy:run

# Kill webpack-dev-server
kill "$pid"
