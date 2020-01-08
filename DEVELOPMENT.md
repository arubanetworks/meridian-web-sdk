## Deployment

Run `npm version ____` with the version number to do a full npm, Google Cloud
Storage, and GitHub Pages deploy.

### Pre-Release/Beta Versions

Run `SKIP_POSTPUBLISH=true npm version 0.0.0-____beta.0` with the version number to do a full npm, Google Cloud Storage deploy that skips the GitHub Pages deploy for the purpose of publishing a pre-release or beta version that we can hand off to beta testers.
