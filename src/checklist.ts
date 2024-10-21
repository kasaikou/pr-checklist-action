import { headBranch, pullRequestLabels } from "./actions-config";
import { configSchema } from "./config";
import { markdownContents } from "./markdown";

export function mergeCheckList(config: {
    schema: configSchema,
    labels: string[],
}, state?: Map<string, Map<string, boolean>>): markdownContents {

    return config.schema.contents.filter(
        (content) => {
            for (const rule of content.rules) {
                if (rule.branches.length > 0 && !rule.branches.some((branchRule) => {
                    return branchRule.test(headBranch)
                })) {
                    continue
                }

                if (rule.labels.length > 0 && !rule.labels.some((labelRule) => {
                    return config.labels.some(label => labelRule.test(label))
                })) {
                    continue
                }

                return true
            }
            return false
        }
    ).map(
        (content) => {
            const contentName = content.name;
            const currentContentState = state?.get(contentName) ?? new Map<string, boolean>();

            return {
                label: contentName,
                list: content.checks.map((check) => {
                    return {
                        name: check,
                        checked: currentContentState.get(check) ?? false,
                    }
                })
            }
        }
    )
}
