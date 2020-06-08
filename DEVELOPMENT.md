## Deployment

1. Make sure CHANGELOG.md is up to date.
2. `git checkout master`
3. `git pull`
4. `npm version ____` for the new version number.
5. Wait for Travis to finish.
6. Copy/paste the CHANGELOG update into #releases in Slack.
7. That's it!

## Running Local Tag Tracker

Local tag tracker requires Go and Redis to work correctly.
