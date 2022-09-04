import { ErrorMessage, ErrorType } from "./types/types";

// @TODO Think more about message and message templates.
export class LiqualityError extends Error {
    private _errorType: ErrorType;
    private _code: number;
    private _userMsg: ErrorMessage;
    private _devMsg: string;
    private _rawError: never;
    private _data: Array<unknown>;

    constructor(error: {errorType?: ErrorType, code?: number, userMsg: ErrorMessage, devMsg?: string, rawError?: never, data?: Array<unknown>}){
        super();
        this._userMsg= error.userMsg;
        if(error?.code) this._code = error?.code;
        if(error?.errorType) this._errorType = error?.errorType;
        if(error?.devMsg) this._devMsg= error?.devMsg;
        if(error?.data) this._data= error?.data;
        if(error?.rawError) this._rawError = error?.rawError;
    }

    public get code() {
        return this._code;
    }

    public get errorType() {
        return this._errorType;
    }

    public get rawError() {
        return this._rawError;
    }

    public get userMsg() {
        return this._userMsg;
    }

    public get devMsg() {
        return this._devMsg;
    }

    public get data() {
        return this._data;
    }

}
