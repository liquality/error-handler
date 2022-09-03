// Write tests here to ensure the following

import { getError, FAKE_ERROR, throwError } from ".";
import { LiqualityError } from "../liquality-error";
import { OneInchSourceError } from "../types/source-errors";
import { ErrorSource, ErrorType } from "../types/types";
import { withErrorWrapper, wrapError } from "../wrapper";


describe('OneInchAPIParser', () => {

    const wrongErrors =[
        ['error structure is incorrect', FAKE_ERROR],
        ['name is not nodeError', {
            statusCode: 400,
            error: 'Bad Request',
            description: 'Insufficient liquidity',
            requestId: 'string',
            meta: [
                {
                type: 'string',
                value: 'string'
                }
            ],
            name: 'NodeErrr'
        }],
        ['description is incorrect', {
            statusCode: 400,
            error: 'Bad Request',
            description: 'Just something else',
            requestId: 'string',
            meta: [
                {
                type: 'string',
                value: 'string'
                }
            ],
            name: 'NodeError'
        }],
    ];
    it.each(wrongErrors)("Should return a Liquality unknown error when %s", (_test, error) => {
        const liqError1: LiqualityError = getError(() => {
            withErrorWrapper(throwError,ErrorSource.OneInchAPI, [error])
        });

        const liqError2: LiqualityError = wrapError(error, [ErrorSource.OneInchAPI])

        expect(liqError1.errorType).toBe(ErrorType.Unknown);
        expect(liqError2.errorType).toBe(ErrorType.Unknown);

    });

    it('Should return a known Liquality error type when error is valid', () => {
        const validError: OneInchSourceError = {
            statusCode: 400,
            error: 'Bad Request',
            description: 'Insufficient liquidity',
            requestId: 'string',
            meta: [
                {
                type: 'string',
                value: 'string'
                }
            ],
            name: 'NodeError'
        }
        const liqError: LiqualityError = getError(() => {
            withErrorWrapper(throwError,ErrorSource.OneInchAPI, [validError])
        });

        expect(liqError.errorType).toBeTruthy();
        expect(liqError.errorType).not.toBe(ErrorType.Unknown);
    })
});
