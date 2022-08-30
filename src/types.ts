// A target can refer to endpoint(s)(Rpc or Api), a package/package function(s), Contract/Contract function(s) 
// It's just a database of functionalities consumed by Liquality whether they are external or internal so long as they do not themselves use the liquality Error Handler package
export enum Targets {
    OneInchQuoteAPI = 'OneInchQuoteAPI',
}

export type Errors<SourceError> = Record<string, SourceError>; 
export type ErrorCodes = Record<ErrorType, number>;
export enum ErrorType {
    Validation = 'Validation',
    Internal = 'Internal',
    InvalidErrMsgRequest = 'InvalidErrMsgRequest',
    Unknown = 'Unknown'
}

export interface DiscordReportConfig {
    username: string,
    // Coming soon
}
export interface EmailReportConfig {
    sendingEmail: string,
    // Coming Soon
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

export interface ErrorMeaning {
    code: number;
    devMsg: string;
    errorType: ErrorType;
}

// These are the 
export enum UserContext {
    NA = 'NA',
    LOGIN = "LOGIN",
}

export interface MessageCreators {
    [ErrorType.Validation]: {
        [UserContext.LOGIN]: (data: unknown) => string | string
    }
}


