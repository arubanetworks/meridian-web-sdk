## Deployment

Run `npm login` and enter your npm credentials before proceeding. You only need to do this once.

Run `npm version ____` with the version number to do a full npm, Google Cloud Storage, and GitHub Pages deploy.

This should automatically publish to npm. If the publish fails, you can manually run `npm publish` to attempt publishing again.

Copy the relevant section of CHANGELOG.md and post it in #releases in Slack.

### Pre-Release/Beta Versions

Run `BETA="____beta" npm version 0.0.0-____beta.0` to do a full npm, Google Cloud Storage deploy that publishes a beta version to npm and skips the GitHub Pages deploy.

## Running Local Tag Tracker

Local tag tracker requires Go and Redis to work correctly.
