/**
 * Module providing common utility functions for use across multiple JavaScript files.
 *
 * @module Utils
 */

/**
 * A boolean flag indicating whether or not debugging is enabled.
 *
 * @type {boolean}
 */
const DEBUG_FLAG = false;

/**
 * Prints a debug message to the console.
 *
 * @param {string} msg - The debug message to print.
 * @param {Object} [obj] - An object to print along with the debug message.
 * @param {Object} [options] - An object containing optional parameters.
 * @param {string} [options.color="blue"] - The color of the debug message.
 * @param {Function} [options.predicate] - A function that returns a boolean indicating whether or not the debug message should be printed.
 * @param {string} [options.passed] - The message to print if the predicate function returns true.
 * @param {string} [options.failed] - The message to print if the predicate function returns false.
 * @param {Array<string>} [options.properties] - An array of property names to include in the output.
 */
function debug(msg, obj = undefined, options = {}) {
    if (DEBUG_FLAG) {
        let { color = "blue", predicate, passed, failed, properties } = options;

        let output = `[DEBUG (${getCallerName()})] ${msg}`;

        if (obj) {
            if (properties && properties.length > 0) {
                output += ": " + JSON.stringify(obj, properties, 2);
            } else {
                output += ": " + JSON.stringify(obj, null, 2);
            }
        }

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

/**
 * Returns the name of the function that called the current function.
 *
 * @returns {string} - The name of the calling function.
 */
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

// Export the variables and functions for use in other modules.
export { debug };
