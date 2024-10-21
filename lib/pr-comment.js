"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPrevComment = findPrevComment;
exports.upsertComment = upsertComment;
const markdown_1 = require("./markdown");
function findPrevComment(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let after = null;
        let hasNextPage = true;
        while (hasNextPage) {
            const data = yield input.octokit.graphql(`
            query($repo: String! $owner: String! $number: Int! $after: String) {
                viewer { login }
                repository(name: $repo owner: $owner) {
                pullRequest(number: $number) {
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
            `, {
                owner: input.owner,
                repo: input.repo,
                number: input.number,
                after: after,
            });
            const viewer = data.viewer;
            const repository = data.repository;
            const target = (_c = (_b = (_a = repository.pullRequest) === null || _a === void 0 ? void 0 : _a.comments) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.find((node) => {
                var _a, _b;
                return ((_a = node === null || node === void 0 ? void 0 : node.author) === null || _a === void 0 ? void 0 : _a.login) === viewer.login.replace("[bot]", "") &&
                    ((_b = node === null || node === void 0 ? void 0 : node.body) === null || _b === void 0 ? void 0 : _b.includes(markdown_1.prefixComment));
            });
            if (target) {
                return target;
            }
            after = (_f = (_e = (_d = repository.pullRequest) === null || _d === void 0 ? void 0 : _d.comments) === null || _e === void 0 ? void 0 : _e.pageInfo) === null || _f === void 0 ? void 0 : _f.endCursor;
            hasNextPage = (_k = (_j = (_h = (_g = repository.pullRequest) === null || _g === void 0 ? void 0 : _g.comments) === null || _h === void 0 ? void 0 : _h.pageInfo) === null || _j === void 0 ? void 0 : _j.hasNextPage) !== null && _k !== void 0 ? _k : false;
        }
        return undefined;
    });
}
function upsertComment(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (input.commentId) {
            yield input.octokit.graphql(`
                mutation($input: UpdateIssueCommentInput!) {
                updateIssueComment(input: $input) {
                        issueComment {
                            id
                            body
                        }
                    }
                }
            `, {
                input: {
                    id: input.commentId,
                    body: input.comment,
                }
            });
        }
        else {
            yield input.octokit.rest.issues.createComment({
                owner: input.owner,
                repo: input.repo,
                issue_number: input.number,
                body: input.comment,
            });
        }
    });
}
