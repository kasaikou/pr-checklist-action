import * as core from "@actions/core";
import { configSchema } from "./config";
import { markdownContents } from "./markdown";

export function mergeCheckList(config: {
    schema: configSchema,
    labels: string[],
}, state?: { [key: string]: { [key: string]: boolean } }): markdownContents {

    return config.schema.contents.filter(
        (content) => {
            content.rules.some(
                rule => {
                    if (rule.labels.length > 0) {
                        if (rule.labels.some((labelRule) => {
                            return config.labels.some(label => labelRule.test(label))
                        }) === false) {
                            return false
                        }
                    }
                    return true
                }
            )
        }
    ).map(
        (content) => {
            const contentName = content.name;
            const currentContentState = state?.[contentName] ?? {};

            core.info("watching '" + contentName + "'")

            return {
                label: contentName,
                list: content.checks.map((check) => {
                    return {
                        name: check,
                        checked: currentContentState[check] ?? false,
                    }
                })
            }
        }
    )
}
