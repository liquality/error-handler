import { asyncFunctionWithError, FAKE_ERROR, getError, getErrorAsync, functionWithError } from ".";
import { ErrorMessages, ERROR_CODES, REPORTERS } from "../config";
import { LiqualityError } from "../liquality-error";
import { ErrorType, ReportType, ErrorSource } from "../types/types";
import { Wrapper } from "../wrapper";
import { OneInchAPIErrorParser } from "../parsers";

// These tests are focused on checking the functionality of Wrapper.
// OneInchQuoteAPI handler was arbitrarily chosen to aid in the test.
// Since handleError function has been mocked here, the choice of OneInchQuoteAPI does not bias the test in any way.
describe('wrapped call', () => {
    let wrapper: Wrapper;
    beforeAll(() => {
        jest.spyOn(OneInchAPIErrorParser.prototype, 'parseError').mockImplementation(() => { return new LiqualityError({
            errorType: ErrorType.InsufficientGasFee,
            code: ERROR_CODES.OneInchAPI,
            userMsg: ErrorMessages.InsufficientGasFee(),
            devMsg:'Not Sure what more to say',
            rawError: {} as never,
            data: []
        })});
    });

    beforeEach(() => {
        wrapper = new Wrapper();
    })

    it('should should not log anything',async () => {
        const logSpy = jest.spyOn(console, 'log');

        getError(() => {
            wrapper.wrap(functionWithError,[], null, ErrorSource.OneInchAPI)
        });
        
        expect(logSpy).toHaveBeenCalledTimes(0);
    });

    describe('that throws error', () => {
        it('should throw a Liquality Error(extends Error) if function is sync',async () => {
            const error = getError(() => {
                wrapper.wrap(functionWithError,[], null, ErrorSource.OneInchAPI)
            });
            
            expect(error).toBeInstanceOf(Error);            
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should throw a Liquality Error(extends Error) if function is async',async () => {
            const error = await getErrorAsync(async () => {
                await wrapper.wrapAsync(asyncFunctionWithError,[], null, ErrorSource.OneInchAPI)
            });

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should report error to console if console reporting enabled',async () => {
            wrapper.reportConfig({[ReportType.Console]: true});
            const reportToConsoleSpy = jest.spyOn(REPORTERS, ReportType.Console);

            getError(() => {
                wrapper.wrap(functionWithError,[], null, ErrorSource.OneInchAPI)
            });
            
            expect(reportToConsoleSpy).toHaveBeenCalled();
        });
    });
});



