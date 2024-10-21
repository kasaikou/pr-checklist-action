"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const actions_config_1 = require("./actions-config");
const github_pr_1 = require("./github-pr");
const markdown_1 = require("./markdown");
const config_1 = require("./config");
const checklist_1 = require("./checklist");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!actions_config_1.pullRequestNumber) {
            core.info("no pull request numbers given: this action skip step");
            return;
        }
        const schema = (0, config_1.readConfig)(actions_config_1.configFile);
        const octokit = github.getOctokit(actions_config_1.githubToken);
        const labels = (_a = yield (0, github_pr_1.getLabels)({
            octokit,
            repo: actions_config_1.repository.repo,
            owner: actions_config_1.repository.owner,
            number: actions_config_1.pullRequestNumber,
        })) !== null && _a !== void 0 ? _a : [];
        const comment = yield (0, github_pr_1.findPrevComment)({
            octokit,
            repo: actions_config_1.repository.repo,
            owner: actions_config_1.repository.owner,
            number: actions_config_1.pullRequestNumber,
        });
        const currentStatus = (comment === null || comment === void 0 ? void 0 : comment.body) ? (0, markdown_1.parseCheckList)(comment === null || comment === void 0 ? void 0 : comment.body) : undefined;
        const contents = (0, checklist_1.mergeCheckList)({ schema, labels }, currentStatus);
        yield (0, github_pr_1.upsertComment)({
            octokit,
            repo: actions_config_1.repository.repo,
            owner: actions_config_1.repository.owner,
            number: actions_config_1.pullRequestNumber,
            comment: (0, markdown_1.renderCheckList)({ contents }),
            commentId: comment === null || comment === void 0 ? void 0 : comment.id,
        });
    });
}
run();
