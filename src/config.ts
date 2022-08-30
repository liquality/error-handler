import { OneInchQuoteAPIHandler } from "./handlers/one-inch/quote-api";
import { LiqualityError } from "./liquality-error";
import { validationErrorAtLogin } from "./messages";
import { reportToConsole } from "./reporters/console";
import { reportToDiscord } from "./reporters/discord";
import { reportToEmail } from "./reporters/email";
import { ErrorCodes, ErrorType, MessageCreators, ReportType, ErrorSource, UserContext } from "./types";

export const DEFAULT_ERR_CODES: ErrorCodes = (() => {
    let errorCodes = {};
    Object.keys(ErrorType).forEach((errorType, index) => {
        errorCodes = {...errorCodes, [errorType]: index + 1}
    });

    return errorCodes;
})() as ErrorCodes;

export const ERR_CODE_PREFIX: Record<ErrorSource,number> = {
    [ErrorSource.OneInchQuoteAPI] : 1000
}

// We will have a errorSourceToHandlerClass mapping here ...
export const HANDLERS = {
    [ErrorSource.OneInchQuoteAPI]: OneInchQuoteAPIHandler
}

export const REPORTERS: Record<ReportType, (error: LiqualityError<unknown>) => void> = {
    [ReportType.Console]: reportToConsole,
    [ReportType.Discord]: reportToDiscord,
    [ReportType.Email]: reportToEmail,
}

export const MESSAGES: MessageCreators = {
    [ErrorType.Validation] : {
        [UserContext.LOGIN]: validationErrorAtLogin,
    }
}