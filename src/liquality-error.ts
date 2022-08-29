import { ErrorMeaning } from "./types";

// @TODO Think more about message and message templates.
export class LiqualityError<SourceError> extends Error {
    private _code: number;
    private _msgDescription: string;
    private _rawError: SourceError;
    private _devMsg: unknown;

    constructor(error: ErrorMeaning & {rawError: SourceError}){
        super();
        this._code = error.code;
        this.message = error.message;
        this._devMsg = error.devMsg;
        this._rawError = error.rawError;
    }

    public get code() {
        return this._code;
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

}
