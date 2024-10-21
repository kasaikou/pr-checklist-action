import { GitHub } from "@actions/github/lib/utils";
import {
    IssueComment,
    Repository,
    User,
} from "@octokit/graphql-schema";
import { prefixComment } from "./markdown";

export async function getLabels(input: {
    octokit: InstanceType<typeof GitHub>,
    owner: string,
    repo: string,
    number: number,
}) {

    let after = null;
    let hasNextPage = true;
    let labels: string[] = [];

    while (hasNextPage) {

        const data = await input.octokit.graphql<{ repository: Repository; viewer: User }>(
            `
            query($repo: String! $owner: String! $number: Int! $after: String) {
                viewer { login }
                repository(name: $repo owner: $owner) {
                pullRequest(number: $number) {
                    labels(first: 100, after: $after) {
                        nodes {
                            name
                        }
                    }
                }
                }
            }
        `,
            {
                owner: input.owner,
                repo: input.repo,
                number: input.number,
                after: after,
            }
        )

        const repository = data.repository as Repository;
        const labelsPart = repository.pullRequest?.labels?.nodes?.map(x => x!.name);
        if (labelsPart) {
            labels.push(...labelsPart)
        } else {
            break
        }

        after = repository.pullRequest?.labels?.pageInfo.endCursor;
        hasNextPage = repository.pullRequest?.labels?.pageInfo.hasNextPage ?? false;
    }

    return labels;
}

export async function findPrevComment(input: {
    octokit: InstanceType<typeof GitHub>,
    owner: string,
    repo: string,
    number: number,
}
): Promise<IssueComment | undefined> {

    let after = null;
    let hasNextPage = true;

    while (hasNextPage) {
        const data = await input.octokit.graphql<{ repository: Repository; viewer: User }>(
            `
            query($repo: String! $owner: String! $number: Int! $after: String) {
                viewer { login }
                repository(name: $repo owner: $owner) {
                pullRequest(number: $number) {
                    labels {
                        
                    }
                    comments(first: 100 after: $after) {
                    nodes {
                        id
                        author {
                        login
                        }
                        isMinimized
                        body
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                    }
                }
                }
            }
            `,
            {
                owner: input.owner,
                repo: input.repo,
                number: input.number,
                after: after,
            }
        );

        const viewer = data.viewer as User;
        const repository = data.repository as Repository;

        const target = repository.pullRequest?.comments?.nodes?.find(
            (node: IssueComment | null | undefined) =>
                node?.author?.login === viewer.login.replace("[bot]", "") &&
                node?.body?.includes(prefixComment)
        );

        if (target) {
            return target;
        }

        after = repository.pullRequest?.comments?.pageInfo?.endCursor;
        hasNextPage = repository.pullRequest?.comments?.pageInfo?.hasNextPage ?? false
    }

    return undefined
}

export async function upsertComment(input: {
    octokit: InstanceType<typeof GitHub>,
    owner: string,
    repo: string,
    number: number,
    comment: string,
    commentId?: string,
}) {
    if (input.commentId) {
        await input.octokit.graphql(
            `
                mutation($input: UpdateIssueCommentInput!) {
                updateIssueComment(input: $input) {
                        issueComment {
                            id
                            body
                        }
                    }
                }
            `,
            {
                input: {
                    id: input.commentId,
                    body: input.comment,
                }
            }
        )
    } else {
        await input.octokit.rest.issues.createComment({
            owner: input.owner,
            repo: input.repo,
            issue_number: input.number,
            body: input.comment,
        })
    }
}
