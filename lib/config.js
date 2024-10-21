"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = readConfig;
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const zod_1 = require("zod");
const zodRegExp = zod_1.z.string().transform((expr) => new RegExp(expr));
const zodConfigContentRuleSchema = zod_1.z.object({
    branches: zod_1.z.array(zodRegExp),
    paths: zod_1.z.array(zodRegExp),
    labels: zod_1.z.array(zodRegExp),
});
const zodConfigContentSchema = zod_1.z.object({
    name: zod_1.z.string(),
    rules: zod_1.z.array(zodConfigContentRuleSchema),
    checks: zod_1.z.array(zod_1.z.string()).default([]),
});
const zodConfigSchema = zod_1.z.object({
    contents: zod_1.z.array(zodConfigContentSchema)
});
function readConfig(path) {
    return zodConfigSchema.parse(yaml_1.default.parse(fs_1.default.readFileSync(path, 'utf-8')));
}
