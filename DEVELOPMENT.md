## Deployment

1. Make sure CHANGELOG.md is up to date.

2. `git checkout master`

3. `git pull`

4. `npm version ____` for the new version number.

5. Wait for Travis to finish.
   <https://travis-ci.com/github/arubanetworks/meridian-web-sdk/builds>

6. Copy/paste the CHANGELOG update into #releases in Slack.

7. That's it!

## Local Docs

1. `npm run docs`

2. `npx serve docs`

You will need to re-run `npm run docs` every time you change the docs.

## Running Local Tag Tracker

Local tag tracker requires Go and Redis to work correctly.

## Cypress Tests

To run local Cypress tests, start your local development server normally. Then, in another terminal, run `npx cypress open`. You can then use the Cypress UI to run your tests. Travis CI runs these tests on each commit.
