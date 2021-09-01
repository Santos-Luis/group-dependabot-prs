# group-dependabot-prs
Intended to group all the opened dependabot PRs into a single one, making the testing and merging process easier.

Simplified version of a combination between [combine-prs-workflow](https://github.com/hrvey/combine-prs-workflow) and [combine-dependabot-prs](https://github.com/mAAdhaTTah/combine-dependabot-prs)

## Inputs
- baseBranch:
  - description: 'Branch to PR into'
  - required: true
  - default: 'master'
- combineBranchName:
  - description: 'Name of the branch to combine PRs into'
  - required: true
  - default: 'combined-denpendabot-prs'
- combinePullRequestTitle:
  - description: 'Title of the pull request to combine PRs into'
  - required: true
  - default: 'combined-denpendabot-prs'


## Example usage
```
name: "Combine Dependabot PRs"
on:
  workflow_dispatch:

jobs:
  combine-prs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2.3.3
      - uses: Santos-Luis/group-dependabot-prs@main
        with:
          baseBranch: 'master'
          combineBranchName: 'combined-prs'
          combinePullRequestTitle: 'Combined dependabot PRs'
```
