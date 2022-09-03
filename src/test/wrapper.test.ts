import { FAKE_ERROR, getError, functionWithError, asyncFunctionWithError, getErrorAsync, classWithErrorFunction } from ".";
import { ErrorMessages, ERROR_CODES, REPORTERS } from "../config";
import { LiqualityError } from "../liquality-error";
import { ErrorType, ErrorSource, ReportType } from "../types/types";
import { OneInchAPIErrorParser } from "../parsers";
import { withErrorWrapper, withErrorWrapperAsync } from "../wrapper";
import { setReportConfig } from "../reporters";

// These tests are focused on checking the functionality of Wrapper.
// OneInchAPI parser was arbitrarily chosen to aid in the test.
// Since handleError function has been mocked here, the choice of OneInchAPI does not bias the test in any way.
describe('wrapped call', () => {    
    beforeAll(() => {
        jest.spyOn(OneInchAPIErrorParser.prototype, 'parseError').mockImplementation(() => { return new LiqualityError({
            errorType: ErrorType.InsufficientGasFee,
            code: ERROR_CODES.OneInchAPI,
            userMsg: ErrorMessages.InsufficientGasFee(),
            devMsg:'Not Sure what more to say',
            rawError: FAKE_ERROR as never,
            data: []
        })});
    });

    it('should should not log anything',async () => {
        const logSpy = jest.spyOn(console, 'log');

        getError(() => {
            withErrorWrapper(functionWithError,ErrorSource.OneInchAPI)
        });
        
        expect(logSpy).toHaveBeenCalledTimes(0);
    });

    describe('that throws error', () => {
        it('should throw a Liquality Error(extends Error) if function is sync',async () => {
            const error = getError(() => {
                withErrorWrapper(functionWithError,ErrorSource.OneInchAPI, )
            });
            
            expect(error).toBeInstanceOf(Error);            
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should throw a Liquality Error(extends Error) if function is async',async () => {
            const error = await getErrorAsync(async () => {
                await withErrorWrapperAsync(asyncFunctionWithError,ErrorSource.OneInchAPI)
            });

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should throw a Liquality Error(extends Error) if function is a method of an instance',async () => {
            const obj = new classWithErrorFunction();
            const error = getError(() => {
                withErrorWrapper(obj.functionWithError,ErrorSource.OneInchAPI, [], 8)
            });
            
            expect(error).toBeInstanceOf(Error);            
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should throw a Liquality Error(extends Error) if async function is method of an instance',async () => {
            const obj = new classWithErrorFunction();
            const error = await getErrorAsync(async () => {
                await withErrorWrapperAsync(obj.asyncfunctionWithError,ErrorSource.OneInchAPI, [], obj)
            });

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(FAKE_ERROR);
        });

        it('should report error to console if console reporting enabled',async () => {
            setReportConfig({[ReportType.Console]: true});
            const reportToConsoleSpy = jest.spyOn(REPORTERS, ReportType.Console);

            getError(() => {
                withErrorWrapper(functionWithError,ErrorSource.OneInchAPI)
            });
            
            expect(reportToConsoleSpy).toHaveBeenCalled();
        });
    });
});



