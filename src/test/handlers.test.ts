// Write tests here to ensure the following

import { getError, targetWithError } from ".";
import { LiqualityError } from "../liquality-error";
import { ErrorType, Targets } from "../types";
import { Wrapper } from "../wrapper";

// - handleError should return an ErrorMeaning Object when each of the available handlers are invoked.
// - no console statement should be found in each of the available handlers.

describe('For wrapped call', () => {
    let wrapper: Wrapper;

    beforeEach(() => {
        wrapper = new Wrapper();
    })

    const targets = Object.values(Targets);
    it.each(targets)("Handler for %s should not log anything to console", target => {
        const logSpy = jest.spyOn(console, 'log');

        getError(() => {
            wrapper.wrap(targetWithError,[], null, target)
        });
        
        expect(logSpy).toHaveBeenCalledTimes(0);
    });

    it.each(targets)("Handler for %s return proper Error Meaning", target => {

        const error: LiqualityError<unknown> = getError(() => {
            wrapper.wrap(targetWithError,[], null, target)
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
