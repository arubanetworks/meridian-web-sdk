## Deployment

Run `npm login` and enter your NPM credentials before proceeding.

Run `npm version ____` with the version number to do a full npm, Google Cloud
Storage, and GitHub Pages deploy.

### Pre-Release/Beta Versions

Run `BETA="0.0.0-____beta.0" SKIP_POSTPUBLISH=true npm version 0.0.0-____beta.0` to do a full npm, Google Cloud Storage deploy that publishes a beta version to npm and skips the GitHub Pages deploy.
