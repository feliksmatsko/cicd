const core = require('@actions/core');
const github = require('@actions/github');

const versionPattern = /^v\d+\.\d+\.\d+$/;

function run() {
  try {
    const release = github.context.payload.release;
    core.setOutput('tag_name', release.tag_name);

    if (!versionPattern.test(release.tag_name)) {
      core.setFailed(`Tag name ${release.tag_name} doesn't match version pattern v0.0.0`);
      return;
    }

    const version = release.tag_name.replace('v', '');
    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();