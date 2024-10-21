"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCheckList = mergeCheckList;
const actions_config_1 = require("./actions-config");
function mergeCheckList(config, state) {
    return config.schema.contents.filter((content) => {
        for (const rule of content.rules) {
            if (rule.branches.length > 0 && !rule.branches.some((branchRule) => {
                return branchRule.test(actions_config_1.headBranch);
            })) {
                continue;
            }
            if (rule.labels.length > 0 && !rule.labels.some((labelRule) => {
                return config.labels.some(label => labelRule.test(label));
            })) {
                continue;
            }
            return true;
        }
        return false;
    }).map((content) => {
        var _a;
        const contentName = content.name;
        const currentContentState = (_a = state === null || state === void 0 ? void 0 : state.get(contentName)) !== null && _a !== void 0 ? _a : new Map();
        return {
            label: contentName,
            list: content.checks.map((check) => {
                var _a;
                return {
                    name: check,
                    checked: (_a = currentContentState.get(check)) !== null && _a !== void 0 ? _a : false,
                };
            })
        };
    });
}
