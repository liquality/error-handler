// Import parser classes here

import { ERROR_ID_LENGTH, ERROR_VALIDATORS, PARSERS } from "../config";
import { ErrorSource, ErrorParser } from "../types/types";
import randomBytes from 'randombytes';

const parserCache: { [key: string]: ErrorParser<unknown> } = {};

// export function for instantiating parser classes.
// Parser should be cached upon instantiation
export function createParser(errorSource: ErrorSource): ErrorParser<unknown> {
    const parser =  new PARSERS[errorSource]();
    parserCache[errorSource] = parser;

    return parser;
}

// export a function for getting a parser
// The function should check cache first and only instantiate
// a new parser if non exists in cache.
export function getParser(errorSource: ErrorSource): ErrorParser<unknown>{
    const cachedParser = parserCache[errorSource];
    if(cachedParser) return cachedParser;

    return createParser(errorSource);
}

export const isValidSourceError = (errorSource: ErrorSource, error: unknown) =>{
    return ERROR_VALIDATORS[errorSource](error);
} 

export function suggestContactSupport(): string {
    return `If it persist, please contact support on discord with errorId: ${randomBytes(ERROR_ID_LENGTH)}`
}
