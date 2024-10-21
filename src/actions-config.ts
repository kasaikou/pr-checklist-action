import * as core from "@actions/core";
import * as github from "@actions/github";
import { context } from "@actions/github";

export const repository = context.repo;
export const pullRequestNumber = context.payload.pull_request?.number;
export const githubToken = core.getInput("GITHUB_TOKEN", { required: true })
export const configFile = core.getInput("config", { required: false })
