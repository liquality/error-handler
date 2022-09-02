// Write tests here to ensure the following

import { getError, functionWithError } from ".";
import { LiqualityError } from "../liquality-error";
import { ErrorSource, ErrorType } from "../types/types";
import { wrap } from "../wrapper";


describe('For wrapped call', () => {

    const errorSources = Object.values(ErrorSource);
    it.each(errorSources)("Handler for %s should not log anything to console", errorSource => {
        const logSpy = jest.spyOn(console, 'log');

        getError(() => {
            wrap(functionWithError,errorSource)
        });
        
        expect(logSpy).toHaveBeenCalledTimes(0);
    });

    it.each(errorSources)("Handler for %s return proper Error Meaning", errorSource => {

        const error: LiqualityError = getError(() => {
            wrap(functionWithError,errorSource)
        });
        
        expect(error.code).toBeTruthy();
        expect(Object.values(ErrorType).includes(error.errorType)).toBe(true);
        expect(error.code).toBeGreaterThanOrEqual(1000); // 1000 is the least code
        expect(error.userMsg.cause).toBeTruthy();
        expect(error.userMsg.suggestions).toBeInstanceOf(Array);
        expect(error.rawError).toBeTruthy();
        expect(error.data).toBeInstanceOf(Array);
    });
});
