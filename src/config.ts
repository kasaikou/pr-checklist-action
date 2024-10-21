import YAML from "yaml";
import fs from "fs";
import { z } from "zod";

const zodRegExp = z.string().transform((expr) => new RegExp(expr));

const zodConfigContentRuleSchema = z.object({
    branches: z.array(zodRegExp),
    paths: z.array(zodRegExp),
    labels: z.array(zodRegExp),
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
    return zodConfigSchema.parse(YAML.parse(fs.readFileSync(path, 'utf-8')));
}
