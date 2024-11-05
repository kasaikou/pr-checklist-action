# pr-checklist-action


This action makes checklist for pull request self reviewing.

## Usage

Save `pr-checklist.yaml` in repository root directory.

```yaml
contents:
  - name: SQL
    rules:
      - labels: [^sql$]
    checks:
      - Consider about N + 1 problem?
```

And save `.github/workflows/checklist.yml`

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, labeled, unlabeled]
jobs:
  run:
    permissions:
      contents: read
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: kasaikou/pr-checklist-action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          config: pr-checklist.yaml
```

## Options

| property | required (or default) | description
| :--: | :--: | :--
| github-token | required | GitHub token for read contents and making pull-request comments.
| config | (pr-checklist.yaml) | Config file path.
| message-on-empty | ( :innocent: **Check List is Empty** :innocent:) | Message displaying when there is no applicable checklist.
