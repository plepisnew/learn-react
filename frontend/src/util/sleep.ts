/**
 * Returns a promise, which is resolved in `time` ms. Usage: `await sleep(1000)` or `sleep(1000).then(callbackfn)`
 * @param time - time in miliseconds to be slept for
 * @returns
 */
const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

export default sleep;
