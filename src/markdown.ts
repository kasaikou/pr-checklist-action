import * as core from "@actions/core";
const headingPrefix = "#### "
const checkedPrefix = "- [x] "
const uncheckedPrefix = "- [ ] "

const prefixComment = "<!-- Generated by kasaikou/pr-checklist-action, DO NOT EDIT. -->"
const suffixComment = "<!-- Generated by kasaikou/pr-checklist-action up to here. -->"
export type markdownContents = {
    label: string,
    list: {
        name: string,
        checked: boolean,
    }[]
}[];

export function hasGeneratedText(text: string) {
    return text.includes(prefixComment) && text.includes(suffixComment)
}

export function parseCheckList(markdown: string) {
    const lines = markdown.split('\n')
    let currentLabel = "";
    let resultMap: { [key: string]: { [key: string]: boolean } } = {};

    for (const line of lines) {
        if (line.startsWith(headingPrefix)) {
            currentLabel = line.slice(headingPrefix.length);
            resultMap[currentLabel] = {};

        } else if (line.startsWith(checkedPrefix)) {
            let todoMap = resultMap[currentLabel];
            todoMap[line.slice(checkedPrefix.length)] = true;
            resultMap[currentLabel] = todoMap;

        } else if (line.startsWith(uncheckedPrefix)) {
            let todoMap = resultMap[currentLabel];
            todoMap[line.slice(checkedPrefix.length)] = true;
            resultMap[currentLabel] = todoMap;
        }
    }

    return resultMap
}

export function renderCheckList(input: {
    previousComment?: string
    contents: markdownContents
    messageOnEmpty: string
}) {
    core.info(`## render ${input.contents.length} category`)
    let markdown = "";
    markdown += prefixComment + "\n\n";

    if (input.contents.length == 0) {
        markdown += input.messageOnEmpty
    }

    for (const content of input.contents) {
        markdown += headingPrefix + content.label + "\n\n"
        for (const checkbox of content.list) {
            markdown += (checkbox.checked ? checkedPrefix : uncheckedPrefix) + checkbox.name + "\n"
        }
        markdown += "\n"
    }

    markdown += suffixComment + "\n"

    if (input.previousComment) {
        const prevGeneratedIdxBegin = input.previousComment.indexOf(prefixComment)
        const prevGeneratedIdxEnd = input.previousComment.indexOf(suffixComment) + suffixComment.length
        const prevGenerated = input.previousComment.substring(prevGeneratedIdxBegin, prevGeneratedIdxEnd)

        return input.previousComment.replace(prevGenerated, markdown)
    } else {
        return markdown
    }

}
