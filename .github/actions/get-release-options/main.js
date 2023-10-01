const core = require('@actions/core');
const github = require('@actions/github');

const versionPattern = /^v\d+\.\d+\.\d+$/;

function run() {
  try {
    const {context} = github;
    const release = context.payload.release;
    const repo = context.repo;

    core.info(`Found release tag: ${release.tag_name}`);
    core.setOutput('tag_name', release.tag_name);

    if (!versionPattern.test(release.tag_name)) {
      core.setFailed(`Tag name ${release.tag_name} doesn't match version pattern v0.0.0`);
      return;
    }

    const version = release.tag_name.replace('v', '');
    core.setOutput('version', version);

    const url = `https://github.com/${repo.owner}/${repo.repo}/releases/tag/${release.tag_name}`;
    core.setOutput('url', url);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();