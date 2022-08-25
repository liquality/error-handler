import { DEFAULT_ERR_CODES } from "../config";
import { Errors, ErrorCodes, ErrorType, ErrorMeaning } from "../types";

export abstract class BaseHandler<SourceError extends symbol|string|number = string> {
    protected err: Errors<SourceError>;
    protected errCodes: ErrorCodes;
    protected availableErrTypes: Array<ErrorType>;

    constructor(errorTypes: Array<ErrorType>, errors: Errors<SourceError>){
        this.availableErrTypes = errorTypes;
        this.errCodes = {...DEFAULT_ERR_CODES };
        this.populateErrCodes();
        this.err = errors;
    }

    protected abstract _errCodePrefix(): number;
    protected abstract _handleError(error: SourceError): ErrorMeaning;

    get errCodePrefix(){
        return this._errCodePrefix();
    }

    public populateErrCodes() {
        this.availableErrTypes.forEach(error => {
            this.errCodes[error] = this.errCodePrefix + DEFAULT_ERR_CODES[error]
        })
    }

    public handleError(error: SourceError): ErrorMeaning {
        return this._handleError(error);
    }
}