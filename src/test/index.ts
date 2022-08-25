export function targetWithError() {
    throw FAKE_ERROR;
}

export async function asyncTargetWithError() {
    throw FAKE_ERROR;
}

export function getError(func:() => unknown) {
    try {
        return func()
    } catch (error) {
        return error;
    }
}

export async function getErrorAsync(func: () => Promise<unknown>) {
    try {
        return await func();
    } catch (error) {
        return error;
    }
}

export const FAKE_ERROR = "Insufficient liquidity";