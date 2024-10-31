import * as core from "@actions/core";
import * as github from "@actions/github";
import { configFile, githubToken, messageOnEmpty, pullRequestNumber, repository } from "./actions-config";
import { findPrevComment, getLabels, upsertComment } from "./github-pr";
import { parseCheckList, renderCheckList } from "./markdown";
import { readConfig } from "./config";
import { mergeCheckList } from "./checklist";

async function run(): Promise<undefined> {

    if (!pullRequestNumber) {
        core.info("no pull request numbers given: this action skip step")
        return;
    }

    const schema = readConfig(configFile)
    const octokit = github.getOctokit(githubToken)
    const labels = await getLabels({
        octokit,
        repo: repository.repo,
        owner: repository.owner,
        number: pullRequestNumber,
    }) ?? []
    core.info("found label: " + labels.map(x => `'${x}'`).join(", "))

    const comment = await findPrevComment(
        {
            octokit,
            repo: repository.repo,
            owner: repository.owner,
            number: pullRequestNumber,
        }
    )

    const currentStatus = comment?.body ? parseCheckList(comment?.body) : undefined;
    const contents = renderCheckList({
        previousComment: comment?.body,
        contents: mergeCheckList({ schema, labels }, currentStatus),
        messageOnEmpty: messageOnEmpty,
    })
    core.info("## comments\n\n" + contents)

    await upsertComment({
        octokit,
        repo: repository.repo,
        owner: repository.owner,
        number: pullRequestNumber,
        comment: contents,
        commentId: comment?.id,
    })
}

run();
