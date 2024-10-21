import * as core from "@actions/core";
import * as github from "@actions/github";
import { context } from "@actions/github";

export const repository = context.repo;
export const pullRequestNumber = context.payload.pull_request?.number;
// export const headBranch = core.getInput("GITHUB_HEAD_REF", { required: true })
// export const baseBranch = core.getInput("GITHUB_BASE_REF", { required: true })
export const githubToken = core.getInput("github-token", { required: true })
export const configFile = core.getInput("config", { required: false })

