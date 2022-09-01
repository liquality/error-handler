// Import handler classes here

import { PARSERS } from "../config";
import { ErrorSource, ErrorParser } from "../types/types";

const parserCache: { [key: string]: ErrorParser<unknown> } = {};

// export function for instantiating handler classes.
// Handler should be cached upon instantiation
export function createParser(errorSource: ErrorSource): ErrorParser<unknown> {
    const parser =  new PARSERS[errorSource]();
    parserCache[errorSource] = parser;

    return parser;
}

// export a function for getting a handler
// The function should check cache first and only instantiate
// a new handler if non exists in cache.
export function getParser(errorSource: ErrorSource): ErrorParser<unknown>{
    const cachedHandler = parserCache[errorSource];
    if(cachedHandler) return cachedHandler;

    return createParser(errorSource);
}