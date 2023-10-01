const core = require('@actions/core');
const github = require('@actions/github');

function run() {
  try {
    const release = github.context.payload.release;
    if (!release.prerelease) {
      core.setOutput('prerelease', 'false');
      return;
    }
    const versionPattern = /^v\d+\.\d+\.\d+$/;
    if (!versionPattern.test(release.tag_name)) {
      core.setFailed(`Tag name ${release.tag_name} doesn't match version pattern v0.0.0`);
      return;
    }
    const version = release.tag_name.replace('v', '');
    core.setOutput('version', version);
    core.setOutput('tag_name', release.tag_name);
    core.setOutput('prerelease', 'true');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();