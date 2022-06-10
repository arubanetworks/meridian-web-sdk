#!/usr/bin/env bash
set -eu

# Start webpack-dev-server in the background
# npm start >/dev/null 2>&1 &

# Store its PID
# pid="$!"

# Wait for it to start
# wait-on "http://localhost"


#;lsdf

# Run Cypress
# npx cypress run --quiet --headless --browser chrome
npx start-server-and-test start http://localhost:3030 npm run cy:run

# Kill webpack-dev-server
# kill "$pid"
