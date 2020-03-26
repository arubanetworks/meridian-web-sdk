## Deployment

Run `npm login` and enter your NPM credentials before proceeding.

Run `npm version ____` with the version number to do a full npm, Google Cloud
Storage, and GitHub Pages deploy.

Update the download link on <https://docs.meridianapps.com/hc/en-us/articles/360040165473-Get-the-Web-SDK> to point to the new version.

### Pre-Release/Beta Versions

Run `BETA="____beta" SKIP_POSTPUBLISH=true npm version 0.0.0-____beta.0` to do a full npm, Google Cloud Storage deploy that publishes a beta version to npm and skips the GitHub Pages deploy.
