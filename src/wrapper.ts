
import { getParser } from "./factory";
import { reportLiqError } from "./reporters";
import { ErrorSource } from "./types/types";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function wrap<T extends (...args:any[]) => any>(func: T, errorSource: ErrorSource, args:Parameters<T> = [] as never, obj:any = null,): ReturnType<T> | undefined{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return obj[func.name](...args);
            }
            return func(...args);
        } catch (error) {
            parseError(error,errorSource,args);
        }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export async function wrapAsync<T extends (...args:any[]) => Promise<any>>(func: T, errorSource: ErrorSource, args:Parameters<T> = [] as never, obj: any = null,): Promise<ReturnType<T> | undefined>{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return await obj[func.name](...args);
            }
            return await func(...args);
        } catch (error) {
            parseError(error, errorSource, args);
        }
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function parseError(error: string, errorSource: ErrorSource, data: Array<any>) {
        const parser = getParser(errorSource); // Get error parser class
        const liqError = parser.parseError(error, data); // Get a Liquality standard error from parser.
        reportLiqError(liqError); // Report Liquality error

        throw liqError; 
    }
