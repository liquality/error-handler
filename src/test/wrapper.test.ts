import { asyncFunctionWithError, FAKE_ERROR, getError, getErrorAsync, functionWithError } from ".";
import { DEFAULT_ERR_CODES, REPORTERS } from "../config";
import { BaseHandler } from "../handlers/base-handler";
import { LiqualityError } from "../liquality-error";
import { ErrorType, ReportType, ErrorSource } from "../types";
import { Wrapper } from "../wrapper";

// These tests are focused on checking the functionality of Wrapper.
// OneInchQuoteAPI handler was arbitrarily chosen to aid in the test.
// Since handleError function has been mocked here, the choice of OneInchQuoteAPI does not bias the test in any way.
describe('wrapped call', () => {
    let wrapper: Wrapper;
    beforeAll(() => {
        jest.spyOn(BaseHandler.prototype, 'handleError').mockImplementation(() => { return {
            code: DEFAULT_ERR_CODES.Validation,
            errorType: ErrorType.Validation,
            message: 'Problem with history is giving troubles, Try Clearing Browser Cache or reinnstall wallet',
            devMsg:'Not Sure what more to say',
        }});
    });

    beforeEach(() => {
        wrapper = new Wrapper();
    })

    it('should should not log anything',async () => {
        const logSpy = jest.spyOn(console, 'log');

        getError(() => {
            wrapper.wrap(functionWithError,[], null, ErrorSource.OneInchQuoteAPI)
        });
        
        expect(logSpy).toHaveBeenCalledTimes(0);
    });

    describe('that throws error', () => {
        it('should throw a Liquality Error(extends Error) if function is sync',async () => {
            const error = getError(() => {
                wrapper.wrap(functionWithError,[], null, ErrorSource.OneInchQuoteAPI)
            });
            
            expect(error).toBeInstanceOf(Error);            
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should throw a Liquality Error(extends Error) if function is async',async () => {
            const error = await getErrorAsync(async () => {
                await wrapper.wrapAsync(asyncFunctionWithError,[], null, ErrorSource.OneInchQuoteAPI)
            });

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should report error to console if console reporting enabled',async () => {
            wrapper.reportConfig({[ReportType.Console]: true});
            const reportToConsoleSpy = jest.spyOn(REPORTERS, ReportType.Console);

            getError(() => {
                wrapper.wrap(functionWithError,[], null, ErrorSource.OneInchQuoteAPI)
            });
            
            expect(reportToConsoleSpy).toHaveBeenCalled();
        });
    });
});



