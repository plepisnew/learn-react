/**
 * Options for bubble debugging
 */
export const bubblesDebug = {
    /**
     * Log current `frame`, `dt` and `fps` of current frame to the console
     */
    logFrame: false,
    /**
     * Log the array of bubbles to the console
     */
    logBubbles: false,
};

export const mathDebug = {
    /**
     * Logs calculated expression to the console after every calculation
     */
    logCalculation: true,
    /**
     * Number of decimal digits, exceeding which an expression will retain its original representation
     * i.e. `sqrt(5)` has value `2.23...` but its representation will remain `sqrt(5) `
     */
    lazyCalculationDecimalDigits: 5,
};
