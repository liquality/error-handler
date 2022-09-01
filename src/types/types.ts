// An Error source can refer to endpoint(s)(Rpc or Api), a package/package function(s), Contract/Contract function(s) 
// It's just a database of functionalities consumed by Liquality whether they are external or internal so long as they do not themselves use the liquality Error Handler package

import { LiqualityError } from "../liquality-error";

export enum ErrorType {
    InsufficientLiquidity = 'InsufficientLiquidity',
    InsufficientAllowance = 'InsufficientAllowance',
    InsufficientFunds = 'InsufficientFunds',
    InsufficientGasFee = 'InsufficientGasFee',
    QuoteError = 'QuoteError',
    InternalError = 'InternalError',
    Unknown = 'Unknown'
}

export enum ErrorSource {
    OneInchAPI = 'OneInchAPI',
}

export interface ErrorParser<SourceError> {
    parseError: (error: SourceError, data: Array<unknown>) => LiqualityError 
}

export enum ReportType {
    Console = 'Console',
    Discord = 'Discord',
    Email = 'Email'
};
export interface ReportConfig{
    [ReportType.Console]?: boolean,
    [ReportType.Discord]?: DiscordReportConfig,
    [ReportType.Email]?: EmailReportConfig,
}

export interface DiscordReportConfig {
    username: string,
    // Coming soon
}
export interface EmailReportConfig {
    sendingEmail: string,
    // Coming Soon
}

export interface ErrorMessage {
    cause: string,
    suggestions: Array<string>
}
