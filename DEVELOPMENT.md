## Deployment

Run `npm login` and enter your NPM credentials before proceeding. You only need
to do this once.

Run `npm version ____` with the version number to do a full npm, Google Cloud
Storage, and GitHub Pages deploy.

Update the download link on
<https://docs.meridianapps.com/hc/en-us/articles/360039669854-SDK-Downloads>
to point to the new version.

Copy the relevant section of CHANGELOG.md and post it in #releases in Slack.

### Pre-Release/Beta Versions

Run `BETA="____beta" SKIP_POSTPUBLISH=true npm version 0.0.0-____beta.0` to do a full npm, Google Cloud Storage deploy that publishes a beta version to npm and skips the GitHub Pages deploy.

## Running Local Tag Tracker

Local tag tracker requires Go and Redis to work correctly.
