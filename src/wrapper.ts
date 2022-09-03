/* eslint-disable @typescript-eslint/no-explicit-any */

import { ERROR_VALIDATORS } from "./config";
import { getParser, isValidSourceError } from "./factory";
import { LiqualityError } from "./liquality-error";
import { reportLiqError } from "./reporters";
import { ErrorSource, ErrorType } from "./types/types";

    export function withErrorWrapper<T extends (...args:Array<any>) => any>(func: T, errorSource: ErrorSource, args:Parameters<T> = [] as never, obj?:any): ReturnType<T> | undefined{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return obj[func.name](...args);
            }
            return func(...args) as ReturnType<T>;
        } catch (error) {
            errorSource = isValidSourceError(errorSource, error) ? errorSource : ErrorSource.UnknownSource
            throw parseError(error,errorSource,args);
        }
    }
    
    export async function withErrorWrapperAsync<T extends (...args:Array<any>) => Promise<any>>(func: T, errorSource: ErrorSource, args:Parameters<T> = [] as never, obj?: any): Promise<ReturnType<T> | undefined>{
        try {
            if(obj && typeof obj[func.name] === 'function'){
                return await obj[func.name](...args);
            }
            return await func(...args);
        } catch (error) {
            errorSource = isValidSourceError(errorSource,error) ? errorSource : ErrorSource.UnknownSource
            throw parseError(error, errorSource, args);
        }
    }

    export function wrapError(error: unknown, errorSources: Array<ErrorSource> = [], args:Array<unknown> = []): LiqualityError{
        let parsedError: LiqualityError;
        
        // Get Error Sources that apply
        if(errorSources.length === 0 ){
            errorSources = Object.values(ErrorSource);
            errorSources = errorSources.filter(source => source !== ErrorSource.UnknownSource)
        }

        // Stream line error sources
        const filteredSources: Array<ErrorSource>= [];
        errorSources.forEach(errorSource => {
            if((ERROR_VALIDATORS as any)[errorSource](error)) filteredSources.push(errorSource)
        })

        if(filteredSources.length === 0) {
            parsedError = parseError(error, ErrorSource.UnknownSource, args)
        }else if(filteredSources.length === 1 ){
            parsedError = parseError(error, filteredSources[0], args)
        }else{
            let foundSource = false;
            for(let i = 0; i < filteredSources.length && !foundSource; i++ ){
                parsedError = parseError(error, filteredSources[i]);
                if(parsedError.errorType !== ErrorType.Unknown) foundSource = true;
            }
        }

        //@ts-ignore
        return parsedError;
    }


    function parseError(error: unknown, errorSource: ErrorSource, data: Array<unknown> = []): LiqualityError {
        const parser = getParser(errorSource); // Get error parser class
        const liqError = parser.parseError(error, data); // Get a Liquality standard error from parser.
        reportLiqError(liqError); // Report Liquality error

        return liqError; 
    }
