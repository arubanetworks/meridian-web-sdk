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

## Cypress Tests

To run local Cypress tests, start your local development server normally. Then, in another terminal, run npx cypress open. You can then use the Cypress UI to run your tests. Travis CI runs these tests on each commit.
