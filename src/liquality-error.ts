import { ErrorMeaning, ErrorType } from "./types";

// @TODO Think more about message and message templates.
export class LiqualityError<SourceError> extends Error {
    private _code: number;
    private _errorType: ErrorType;
    private _msgDescription: string;
    private _rawError: SourceError;
    private _devMsg: unknown;
    private _args: unknown;


    constructor(error: Partial<ErrorMeaning & {rawError: SourceError, args: unknown}>){
        super();
        if(error?.code) this._code = error?.code;
        if(error?.errorType) this._errorType = error?.errorType;
        if(error?.devMsg) this._devMsg= error?.devMsg;
        if(error?.args) this._args= error?.args;
        if(error?.rawError) this._rawError = error?.rawError;
    }

    public get code() {
        return this._code;
    }

    public get errorType() {
        return this._errorType;
    }

    public get msgDescription() {
        return this._msgDescription;
    }

    public get rawError() {
        return this._rawError;
    }

    public get devMsg() {
        return this._devMsg;
    }

    public get args() {
        return this._args;
    }

}
