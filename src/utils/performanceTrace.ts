import { logInfo } from "..";

export const logExecutionTimeOfAsyncFunc = async<T>(fn: Promise<T>, identifier: string): Promise<T> => {
    const startTime = performance.now();
    const result = await fn;
    logInfo(`Call ${identifier} took ${performance.now() - startTime} ms`);
    return result;
};