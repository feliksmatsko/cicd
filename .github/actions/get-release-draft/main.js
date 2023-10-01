const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('github-token', {required: true});
        const octokit = github.getOctokit(token);
        const {owner, repo} = github.context.repo;

        core.info(`123 /repos/${owner}/${repo}/releases?per_page=3`);

        const {data} = await octokit.request(`GET /repos/${owner}/${repo}/releases?per_page=3`);

        const tmp = data.map(item => item.name).join(':');
        core.info(`Names list: "${tmp}"`);

        const latestDraftRelease = data.find(release => release.draft);
        console.log(latestDraftRelease)
        core.info(JSON.stringify(latestDraftRelease));

        if (!latestDraftRelease) {
            core.setFailed('No draft releases found.');
            return;
        }

        core.setOutput('version', latestDraftRelease.name);
    } catch (error) {
        core.setFailed(`Failed to get draft releases: ${error}`);
    }
}

run();
