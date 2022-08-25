// Import handler classes here

import { HANDLERS } from "../config";
import { BaseHandler } from "../handlers/base-handler";
import { Targets } from "../types";

const handlerCache: { [key: string]: BaseHandler } = {};

// export function for instantiating handler classes.
// Handler should be cached upon instantiation
export function createHandler(target: Targets): BaseHandler {
    const handler =  new HANDLERS[target]();
    handlerCache[target] = handler;

    return handler;
}

// export a function for getting a handler
// The function should check cache first and only instantiate
// a new handler if non exists in cache.
export function getHandler(target: Targets): BaseHandler{
    const cachedHandler = handlerCache[target];
    if(cachedHandler) return cachedHandler;

    return createHandler(target);
}