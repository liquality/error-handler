// Write tests here to ensure the following

import { getError, functionWithError } from ".";
import { LiqualityError } from "../liquality-error";
import { ErrorType, ErrorSource } from "../types";
import { Wrapper } from "../wrapper";

// - handleError should return an ErrorMeaning Object when each of the available handlers are invoked.
// - no console statement should be found in each of the available handlers.

describe('For wrapped call', () => {
    let wrapper: Wrapper;

    beforeEach(() => {
        wrapper = new Wrapper();
    })

    const errorSources = Object.values(ErrorSource);
    it.each(errorSources)("Handler for %s should not log anything to console", errorSource => {
        const logSpy = jest.spyOn(console, 'log');

        getError(() => {
            wrapper.wrap(functionWithError,[], null, errorSource)
        });
        
        expect(logSpy).toHaveBeenCalledTimes(0);
    });

    it.each(errorSources)("Handler for %s return proper Error Meaning", errorSource => {

        const error: LiqualityError<unknown> = getError(() => {
            wrapper.wrap(functionWithError,[], null, errorSource)
        });
        
        expect(error.code).toBeTruthy();
        expect(Object.values(ErrorType).includes(error.errorType)).toBe(true);
        expect(error.code).toBeGreaterThan(1000); // 1000 is the least code
        expect(error.message).toBeFalsy();
        expect(error.devMsg).toBeTruthy();
        expect(error.rawError).toBeTruthy();
        expect(error.args).toBeInstanceOf(Array);
    });
});
