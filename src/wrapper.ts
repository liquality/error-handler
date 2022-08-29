// Export wrapper function that accepts
// Inputs: Callback Target, Context params
// Output: throw a standard error if error caught

import { getHandler } from "./factory";
import { LiqualityError } from "./liquality-error";
import { reportLiqError } from "./reporters";
import { ErrorMeaning, ReportConfig, Targets } from "./types";

// @TODO Think more about context.
export class Wrapper {

    // Config will contain setup information
    // One of which is credentials that will enable reporting errors
    // E.g Discord Credentials or Email Credentials.
    private _reportConfig: ReportConfig;
    constructor(reportConfig: ReportConfig = {}){
        this._reportConfig = reportConfig;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public wrap<T extends (...args:any[]) => any>(func: T, args:Parameters<T>, obj: any, target: Targets): ReturnType<T> | undefined{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return obj[func.name](...args);
            }
            return func(...args);
        } catch (error) {
            this.handleError(error,target);
        }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async wrapAsync<T extends (...args:any[]) => Promise<any>>(func: T, args:Parameters<T>, obj: any, target: Targets): Promise<ReturnType<T> | undefined>{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return await obj[func.name](...args);
            }
            return await func(...args);
        } catch (error) {
            this.handleError(error,target);
        }
    }

    public reportConfig(config: ReportConfig) {
        this._reportConfig = config;
    }

    private handleError(error: string, target: Targets) {
        const handler = getHandler(target); // Get error handler
        const meaning: ErrorMeaning = handler.handleError(error); // Get the meaning of the error.

        const liqError = new LiqualityError({...meaning, rawError: error}); // Create liquality error

        reportLiqError(liqError, this._reportConfig); // Report Liquality error

        throw liqError; 
    }
}
