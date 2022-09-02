import { ERROR_CODES, ErrorMessages } from "../config";
import { LiqualityError } from "../liquality-error";
import { ErrorParser, ErrorType } from "../types/types";

export class UnknownSourceErrorParser implements ErrorParser<unknown> {

    public parseError(error: unknown, data: never): LiqualityError {
        return new LiqualityError({errorType: ErrorType.Unknown, code: ERROR_CODES.UnknownSource, userMsg: ErrorMessages[ErrorType.Unknown](ERROR_CODES.UnknownSource), devMsg: '', 
        rawError: error as never, data});
    }

}