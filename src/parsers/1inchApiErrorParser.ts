import { ERROR_CODES, ErrorMessages } from "../config";
import { LiqualityError } from "../liquality-error";
import { ErrorMessage, ErrorParser, ErrorType } from "../types/types";
import { OneInchSourceError } from "../types/source-errors";

export class OneInchAPIErrorParser implements ErrorParser<OneInchSourceError> {

    public parseError(error: OneInchSourceError, data: never): LiqualityError {
        let userMsg: ErrorMessage = {cause:'', suggestions:[]} 
        let devMsg = ""
        let errorType: ErrorType

        if(error.name !== 'NodeError'){ // All OneInch errors must satisfy this because they are already wrapped in chainify
            errorType = ErrorType.Unknown;
        }else{
            switch (error.description.toLowerCase()) {
                case "Insufficient liquidity".toLowerCase():
                    errorType = ErrorType.InsufficientLiquidity
                    userMsg = ErrorMessages.InsufficientLiquidity();
                    break;
                case "Cannot estimate".toLowerCase():
                    errorType = ErrorType.QuoteError
                    devMsg = "1inch could not estimate a quote for the swap".toLowerCase()
                    userMsg = ErrorMessages.QuoteError();
                    break;
                case "You may not have enough ETH balance for gas fee".toLowerCase():
                    errorType = ErrorType.InternalError
                    userMsg = ErrorMessages.InternalError()

                    break;
                case "FromTokenAddress cannot be equals to toTokenAddress".toLowerCase():
                    errorType = ErrorType.InternalError
                    userMsg = ErrorMessages.InternalError();
                    break;
                case "Cannot estimate. Don't forget about miner fee. Try to leave the buffer of ETH for gas".toLowerCase():
                    errorType = ErrorType.QuoteError
                    devMsg = "1inch internal error, could be related to slippage for specific tokens"
                    userMsg = ErrorMessages.QuoteError();
                    break;
                case "Not enough balance".toLowerCase():
                    errorType = ErrorType.InsufficientFunds
                    userMsg = ErrorMessages.InsufficientFunds();
                    break;
                case "Not enough allowance".toLowerCase():
                    errorType = ErrorType.InternalError
                    devMsg = "Check the approval process for 1inch, approvals are not being made correctly"
                    userMsg = ErrorMessages.InternalError()
                    break;
                default:
                    errorType = ErrorType.Unknown
                    userMsg = ErrorMessages.Unknown();
                    break;
            }
        }


        userMsg = userMsg.cause ? userMsg : ErrorMessages[errorType]()
        return new LiqualityError({errorType, code: ERROR_CODES.OneInchAPI, userMsg, devMsg, 
        rawError: error as never, data});
    
    }

}