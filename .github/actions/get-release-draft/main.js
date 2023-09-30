const core = require('@actions/core');
const {request} = require("@octokit/request");

async function run() {
    try {
        const token = core.getInput('github-token', {required: true});
        const owner = core.getInput('owner', {required: true});
        const repo = core.getInput('repo', {required: true});

        const {data} = await request(`GET /repos/${owner}/${repo}/releases&per_page=3`, {
            headers: {
                authorization: `token ${token}`,
            },
        });

        const tmp = data.map(item => item.name).join(':');
        core.info(`Names list: "${tmp}"`);

        const latestDraftRelease = data.find(release => release.draft);

        if (!latestDraftRelease) {
            core.setFailed('No draft releases found.');
            return;
        }

        core.setOutput('latest-draft-release-name', latestDraftRelease.name);
    } catch (error) {
        core.setFailed(`Failed to get draft releases: ${error}`);
    }
}

run();
