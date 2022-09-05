import { ErrorMessage, ErrorType } from "./types/types";

export class LiqualityError extends Error {
    errorType: ErrorType;
    code: number;
    userMsg: ErrorMessage;
    devMsg: string;
    rawError: never;
    data: Array<unknown>;

    constructor(error: {errorType?: ErrorType, code?: number, userMsg: ErrorMessage, devMsg?: string, rawError?: never, data?: Array<unknown>}){
        super();
        this.userMsg= error.userMsg;
        if(error?.code) this.code = error?.code;
        if(error?.errorType) this.errorType = error?.errorType;
        if(error?.devMsg) this.devMsg= error?.devMsg;
        if(error?.data) this.data= error?.data;
        if(error?.rawError) this.rawError = error?.rawError;
    }

}
