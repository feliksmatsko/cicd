const core = require('@actions/core');
const github = require('@actions/github');

const versionPattern = /^(v)?\d+\.\d+\.\d+$/;

async function run() {
  try {
    const token = core.getInput('github-token', {required: true});
    const octokit = github.getOctokit(token);
    const {owner, repo} = github.context.repo;

    const {data} = await octokit.request(
      `GET /repos/${owner}/${repo}/releases?per_page=5`
    );

    const latestDraftRelease = data.find(release => release.draft);

    if (!latestDraftRelease) {
      core.setFailed('No draft releases found.');
      return;
    }

    const tagName = latestDraftRelease.tag_name;
    if (versionPattern.test(tagName)) {
      const version = tagName.replace('v', '');
      core.info(`Found draft release: v${version}`);
      core.setOutput('version', version);
    } else {
      core.setFailed(`Invalid tag name: ${tagName}`);
    }
  } catch (error) {
    core.setFailed(`Failed to get draft releases: ${error}`);
  }
}

run();
