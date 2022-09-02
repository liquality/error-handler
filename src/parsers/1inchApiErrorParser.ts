import { ERROR_CODES, ErrorMessages } from "../config";
import { LiqualityError } from "../liquality-error";
import { ErrorMessage, ErrorParser, ErrorType } from "../types/types";
import { OneInchSourceError } from "../types/source-errors";

export class OneInchAPIErrorParser implements ErrorParser<OneInchSourceError> {

    public parseError(error: OneInchSourceError, data: never): LiqualityError {
        let userMsg: ErrorMessage = {cause:'', suggestions:[]} 
        let devMsg = ""
        let errorType: ErrorType

        switch (error?.description?.toLowerCase()) {
            case "Insufficient liquidity".toLowerCase():
                errorType = ErrorType.InsufficientLiquidity
                break;
            case "Cannot estimate".toLowerCase():
                errorType = ErrorType.QuoteError
                devMsg = "1inch could not estimate a quote for the swap".toLowerCase()
                break;
            case "You may not have enough ETH balance for gas fee".toLowerCase():
                errorType = ErrorType.InsufficientGasFee
                userMsg = ErrorMessages.InsufficientGasFee()
                break;
            case "FromTokenAddress cannot be equals to toTokenAddress".toLowerCase():
                errorType = ErrorType.InternalError
                break;
            case "Cannot estimate. Don't forget about miner fee. Try to leave the buffer of ETH for gas".toLowerCase():
                errorType = ErrorType.QuoteError
                devMsg = "1inch internal error, could be related to slippage for specific tokens"
                break;
            case "Not enough balance".toLowerCase():
                errorType = ErrorType.InsufficientFunds
                break;
            case "Not enough allowance".toLowerCase():
                errorType = ErrorType.InternalError
                devMsg = "Check the approval process for 1inch, approvals are not being made correctly"
                break;
            default:
                errorType = ErrorType.Unknown
                break;
        }

        userMsg = userMsg.cause ? userMsg : ErrorMessages[errorType]()
        return new LiqualityError({errorType, code: ERROR_CODES.OneInchAPI, userMsg, devMsg, 
        rawError: error as never, data});
    
    }

}