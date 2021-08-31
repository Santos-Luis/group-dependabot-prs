const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');
const execa = require('execa');

const main = async () => {
    const githubToken = core.getInput('githubToken', { required: true });
    const combineBranchName = core.getInput('combineBranchName', {
        required: true,
    });
    const baseBranch = core.getInput('baseBranch', { required: true });
    const github = getOctokit(githubToken);

    const pulls = await github.paginate('GET /repos/:owner/:repo/pulls', {
        owner: context.repo.owner,
        repo: context.repo.repo
    });

    const branchesToCombine = [];
    const prs = [];

    for (const pull of pulls) {
        const branch = pull['head']['ref'];

        console.log('Pull for branch: ' + branch);

        if (branch.startsWith('dependabot')) {
            console.log('Branch matched: ' + branch);
            console.log('Adding branch to array: ' + branch);
            
            branchesToCombine.push(branch);
            prs.push('#' + pull['number'] + ' ' + pull['title']);
        }
    }

    if (branchesToCombine.length === 0) {
        core.setFailed('No PRs/branches matched criteria');

        return;
    }

    await setupRepository({ baseBranch, combineBranchName, branchesToCombine });

    const body = `This PR was created by the Combine PRs action by combining the following PRs:\n${prs.join('\n')}`;

    const title = core.getInput('combinePullRequestTitle', {
        required: true
    });

    await github.pulls.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title,
        head: combineBranchName,
        base: baseBranch,
        body,
    });
};

const setupRepository = async ({
    baseBranch,
    combineBranchName,
    branchesToCombine,
}) => {
    await execa('git', ['config', 'pull.rebase', 'false']);
    await execa('git', ['config', 'user.name', 'github-actions']);
    await execa('git', ['config', 'user.email', 'github-actions@github.com']);

    await execa('git', ['branch', combineBranchName, baseBranch]);
    await execa('git', ['checkout', combineBranchName]);
    await execa('git', ['pull', 'origin', ...branchesToCombine, '--no-edit']);
    await execa('git', ['push', 'origin', combineBranchName]);
};

main().catch(err => {
    core.error(err);
});
