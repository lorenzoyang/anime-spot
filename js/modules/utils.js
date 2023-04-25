const DEBUG_FLAG = true;

export function debug(msg, options = {}) {
    if (DEBUG_FLAG) {
        let { color = "blue", predicate, passed, failed } = options;

        let output = `[DEBUG: ${getCallerName()}]: ${msg}`;

        if (predicate) {
            const result = predicate();
            output += result
                ? ` -> PASSED: ${passed}`
                : ` -> FAILED: ${failed}`;
            color = result ? "green" : "red";
        }
        console.log(`%c${output}`, `color: ${color}`);
    }
}

function getCallerName() {
    const error = new Error();
    const stackTrace = error.stack.split("\n");

    // The first line of the stack trace is the current function,
    // so we need to take the third line.
    const callerLine = stackTrace[3].trim();

    // The caller function name is the substring between "at " and " ("
    const callerName = callerLine.substring(
        callerLine.indexOf("at ") + 3,
        callerLine.lastIndexOf(" (")
    );

    return callerName;
}
