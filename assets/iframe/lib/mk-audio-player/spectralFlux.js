
/**
 * @param {any} args
 * {
 *      signal: object
 *      previousSignal: object
 * }
 */
function spectralFlux(args) {
    if (typeof args.signal !== 'object' || typeof args.previousSignal !== 'object') {
        return -1;
    }

    return 0;
}
