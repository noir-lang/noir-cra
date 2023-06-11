export function getValuesFromComments(source) {
    const values = {
        ...collectSimple(source),
        ...collectArray(source)
    };

    return values;
}

function collectSimple(source) {

    const result = {};
    const value_spec_regex = /\/\/\s*@value\s+([\w]+)\s*=\s*(\S+)/gm;
    let match;
    while ((match = value_spec_regex.exec(source)) !== null) {
        if (match.index === value_spec_regex.lastIndex) {
            value_spec_regex.lastIndex++;
        }
        result[match[1]] = match[2].startsWith("\"") ? match[2].substring(1, match[2].length - 1) : parseInt(match[2]);
    }

    return result;
}

function collectArray(source) {

    const result = {};
    const array_spec_regex = /\/\/\s*@value\s+([\w]+)\s*=\s*\[(.+)\]/gm;
    let match;
    while ((match = array_spec_regex.exec(source)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === array_spec_regex.lastIndex) {
            array_spec_regex.lastIndex++;
        }
        result[match[1]] = collectArrayElements(match[2]);
    }
    return result;
}

function collectArrayElements(source) {

    const result: any = [];
    const array_spec_regex = /(\d+)/gm;
    let match: any;
    while ((match = array_spec_regex.exec(source)) !== null) {
        if (match.index === array_spec_regex.lastIndex) {
            array_spec_regex.lastIndex++;
        }
        const e = parseInt(match[1] as any) as number;
        result.push(e);
    }
    return result;
}

