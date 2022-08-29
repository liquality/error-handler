import { ERR_CODE_PREFIX } from "../../config";
import { ErrorMeaning, ErrorType } from "../../types";
import { BaseHandler } from "../base-handler";
import { errors, errorTypes } from "./config";
import { OneInchSourceError } from "./types";

// @TODO think more about what parameters to pass when instantiating the Liquality Error
export class OneInchQuoteAPIHandler extends BaseHandler<OneInchSourceError> {

    constructor(){
        super(errorTypes,errors);
    }
    protected _errCodePrefix(){
        return ERR_CODE_PREFIX.OneInchQuoteAPI
    }

    protected _handleError(_error: OneInchSourceError): ErrorMeaning {
        return {
            code: this.errCodes.Validation,
            errorType: ErrorType.Validation,
            message: 'Problem with history is giving troubles, Try Clearing Browser Cache or reinnstall wallet',
            devMsg:'Not Sure what more to say',
        };
    }

}