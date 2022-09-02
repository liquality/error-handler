import { LiqualityError } from "./liquality-error";
import { reportToConsole } from "./reporters/console";
import { reportToDiscord } from "./reporters/discord";
import { reportToEmail } from "./reporters/email";
import {ReportType, ErrorSource, ErrorType, ErrorMessage } from "./types/types";
import { OneInchAPIErrorParser } from "./parsers";
import { UnknownSourceErrorParser } from "./parsers/UnknownSourceErrorParser";


export const ERROR_CODES: Record<ErrorSource,number> = {
    [ErrorSource.OneInchAPI] : 1000,
    [ErrorSource.UnknownSource] : 10000
}

// We will have a errorSourceToParserClass mapping here ...
export const PARSERS = {
    [ErrorSource.OneInchAPI]: OneInchAPIErrorParser,
    [ErrorSource.UnknownSource]: UnknownSourceErrorParser
}

export const REPORTERS: Record<ReportType, (error: LiqualityError) => void> = {
    [ReportType.Console]: reportToConsole,
    [ReportType.Discord]: reportToDiscord,
    [ReportType.Email]: reportToEmail,
}

export const ErrorMessages: Record<ErrorType,(...args:Array<unknown>)=>ErrorMessage> = {
    [ErrorType.InternalError]: (errorcode: string) => {
        return {
            cause: 'Sorry, something went wrong while processing this transaction.',
            suggestions: [
                'Try again at a later time',
                `If it persist, please contact support on discord with errorCode: ${errorcode}`
            ]
        }
    },
    [ErrorType.InsufficientLiquidity]: () => {
        return {
            cause: 'Sorry, your swap transaction could not be completed due to not enough liquidity on the selected swap provider.',
            suggestions: [
                'Reduce your swap amount',
                'Try a different swap pair',
                'Select a different swap provider from our list of swap providers',
                'Try again at a later time'
            ]
        }
    },
    [ErrorType.QuoteError]: (errorcode: string) => {
        return {
            cause: 'Sorry, quote could not be obtained for this swap at the moment, this could be due to network congestion or the pair you\'re trying to swap.',
            suggestions: [
                'Try another swap pair',
                'Try again at a later time',
                `If it persist, please contact support on discord with errorCode: ${errorcode}`
            ]
        }
    },
    [ErrorType.InsufficientGasFee]: (currency = "native currency", feeDeficit?: string ) => {
        return {
            cause:  `Sorry, you do not have enough ${currency} to cover transaction fee.  ${feeDeficit? 'You will need additional ' + feeDeficit + currency : ''}`,
            suggestions: []
        }
    },
    [ErrorType.InsufficientFunds]: () => {
        return {
            cause:  '',
            suggestions: []
        }
    },
    [ErrorType.InsufficientAllowance]: () => {
        return {
            cause:  '',
            suggestions: []
        }
    },
    [ErrorType.Unknown]: () => {
        return {
            cause:  'Sorry, something went wrong while processing this transaction.',
            suggestions: []
        }
    }
}

export const ERROR_VALIDATORS: Omit<Record<ErrorSource, (error: unknown) => boolean>, ErrorSource.UnknownSource> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    OneInchAPI: (_error: unknown) => {
        return true;
    },
}