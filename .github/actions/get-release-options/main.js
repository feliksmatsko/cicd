const core = require('@actions/core');
const github = require('@actions/github');

const versionPattern = /^v\d+\.\d+\.\d+$/;
let summary = core.summary;

function setOutput(release, propName, displayName) {
  core.setOutput(propName, release?.tag_name || '');

  if (release) {
    const message = `${displayName}: ${release.tag_name}`
    core.info(message);
    summary = summary.addRaw(message);
  }
}

async function run() {
  try {
    const token = core.getInput('github_token', {required: true});
    const deriveVersion = core.getInput('derive_version', {required: true});
    const octokit = github.getOctokit(token);
    const {owner, repo} = github.context.repo;

    const {data} = await octokit.request(
      `GET /repos/${owner}/${repo}/releases?per_page=10`
    );

    const draft = data.find(release => release.draft);
    const prerelease = data.find(release => release.prerelease);
    const latest = data.find(release => !release.draft && !release.prerelease);

    setOutput(draft, 'current_tag', 'Current draft');
    setOutput(prerelease, 'prerelease_tag', 'Release candidate');
    setOutput(latest, 'latest_tag', 'Latest release');

    await core.summary.write();

    if (deriveVersion === 'false') {
      return;
    }

    if (!draft) {
      core.setFailed('At least one draft release should be created to continue.');
      return;
    }

    if (!versionPattern.test(draft.tag_name)) {
      core.setFailed(`Invalid tag name: ${draft.tag_name}`);
      return;
    }

    const version = draft.tag_name.replace('v', '');
    core.setOutput('current_version', version);
  } catch (error) {
    core.setFailed(`Failed to get draft releases: ${error}`);
  }
}

run();
