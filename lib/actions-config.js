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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullRequestLabels = exports.configFile = exports.githubToken = exports.baseBranch = exports.headBranch = exports.pullRequestNumber = exports.repository = void 0;
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
exports.repository = github_1.context.repo;
exports.pullRequestNumber = (_a = github_1.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number;
exports.headBranch = core.getInput("GITHUB_HEAD_REF", { required: true });
exports.baseBranch = core.getInput("GITHUB_BASE_REF", { required: true });
exports.githubToken = core.getInput("GITHUB_TOKEN", { required: true });
exports.configFile = core.getInput("config", { required: false });
exports.pullRequestLabels = JSON.parse(core.getInput("labels", { required: false }));
