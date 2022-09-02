import { getError } from ".";
import { ERROR_CODES } from "../config";
import { LiqualityError } from "../liquality-error";
import { OneInchSourceError } from "../types/source-errors";
import { ErrorSource } from "../types/types";
import { withErrorWrapper, wrapError } from "../wrapper";

// These tests are focused on showing how the wrapper would work E2E assuming for example that the frontend calls walletCore
// WalletCore calls an external endpoint
// OneInchAPI Parser was arbitrarily chosen to aid in the test.

// Example of a OneInchError
const ONE_INCH_ERROR: OneInchSourceError =  {
    statusCode: ERROR_CODES.OneInchAPI,
    error: 'Bad Request',
    description: 'Insufficient liquidity',
    requestId: 'string',
    meta: [
      {
        type: 'string',
        value: 'string'
      }
    ]
};

const mockOneInchAPI = () => {
    ///... Some codes... 

    // then something went wrong
    throw ONE_INCH_ERROR;
}


class MockWalletCore {
    public swap1() {
        withErrorWrapper(mockOneInchAPI, ErrorSource.OneInchAPI);
    }

    public swap2() {
        try{
            mockOneInchAPI();
        }catch(error){
            throw wrapError(error)
        }    
    }

}
describe('Frontend calls to wallet core', () => {
    const walletCore = new MockWalletCore();

    describe('that throws error', () => {
        it('should throw a Liquality Error(extends Error) if wrapped call approach are used',async () => {
            const error = getError(() => {
                walletCore.swap1();
            });
            
            expect(error).toBeInstanceOf(Error);            
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(ONE_INCH_ERROR);
        });

        it('should throw a Liquality Error(extends Error) if wrapped error approach is used',async () => {
            const error = getError(() => {
                walletCore.swap2();
            });
            
            expect(error).toBeInstanceOf(Error);            
            expect(error).toBeInstanceOf(LiqualityError);
            expect(error.rawError).toBe(ONE_INCH_ERROR);
        });

    });
});


