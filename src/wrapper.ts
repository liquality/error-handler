
import { getParser } from "./factory";
import { reportLiqError } from "./reporters";
import { ReportConfig, ErrorSource } from "./types/types";

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
    public wrap<T extends (...args:any[]) => any>(func: T, args:Parameters<T>, obj: any, errorSource: ErrorSource): ReturnType<T> | undefined{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return obj[func.name](...args);
            }
            return func(...args);
        } catch (error) {
            this.parseError(error,errorSource,args);
        }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async wrapAsync<T extends (...args:any[]) => Promise<any>>(func: T, args:Parameters<T>, obj: any, errorSource: ErrorSource): Promise<ReturnType<T> | undefined>{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return await obj[func.name](...args);
            }
            return await func(...args);
        } catch (error) {
            this.parseError(error, errorSource, args);
        }
    }

    public reportConfig(config: ReportConfig) {
        this._reportConfig = config;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseError(error: string, errorSource: ErrorSource, data: Array<any>) {
        const parser = getParser(errorSource); // Get error parser class
        const liqError = parser.parseError(error, data); // Get a Liquality standard error from parser.
        reportLiqError(liqError, this._reportConfig); // Report Liquality error

        throw liqError; 
    }
}
