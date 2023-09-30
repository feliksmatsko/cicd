const core = require('@actions/core');
const github = require('@actions/github');

try {
    const inputBranch = core.getInput('name');
    const payload = github.context.payload;
    const triggeringBranch = payload.ref.replace('refs/heads/', '');

    if (inputBranch === triggeringBranch) {
        core.info(`Branch name matches: "${inputBranch}"`);
    } else {
        core.setFailed(`Error: Branch name doesn't match. Expected "${inputBranch}", got "${triggeringBranch}"`);
    }
} catch (error) {
    core.setFailed(error.message);
}