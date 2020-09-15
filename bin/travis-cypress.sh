#!/usr/bin/env bash
set -eu

# Start webpack-dev-server in the background
npm start >/dev/null 2>&1 &

# Store its PID
pid="$!"

# Wait for it to start
wait-on "http://localhost:3011"

# Run Cypress
npx cypress run --headless --browser chrome

# Kill webpack-dev-server
kill "$pid"
