const core = require('@actions/core');

function run() {
  try {
    const regExpTemplate = core.getInput('regexp', { required: true });
    const regExp = new RegExp(regExpTemplate, 'i');
    const master = 'master';
    const release = 'release/v1.2.3';

    core.info(`master ${regExp.test(master)}`)
    core.info(`release ${regExp.test(release)}`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
