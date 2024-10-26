import * as core from "@actions/core";
import YAML, { stringify } from "yaml";
import fs from "fs";
import { z } from "zod";

const zodRegExp = z.string().transform((expr) => new RegExp(expr));

const zodConfigContentRuleSchema = z.object({
    branches: z.array(zodRegExp).default([]),
    paths: z.array(zodRegExp).default([]),
    labels: z.array(zodRegExp).default([]),
});

const zodConfigContentSchema = z.object({
    name: z.string(),
    rules: z.array(zodConfigContentRuleSchema),
    checks: z.array(z.string()).default([]),
});

const zodConfigSchema = z.object({
    contents: z.array(zodConfigContentSchema)
});

export type configSchema = z.output<typeof zodConfigSchema>;

export function readConfig(path: string): configSchema {
    const parsed = zodConfigSchema.parse(YAML.parse(fs.readFileSync(path, 'utf-8')));
    core.info(stringify(parsed))
    return parsed
}
