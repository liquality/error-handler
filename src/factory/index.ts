// Import handler classes here

import { HANDLERS, MESSAGES } from "../config";
import { BaseHandler } from "../handlers/base-handler";
import { LiqualityError } from "../liquality-error";
import { ErrorType, Targets, UserContext } from "../types";

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

export function getMessage(type: ErrorType, context?: UserContext, data?: unknown): string | null{
    if(type === ErrorType.Unknown) {
        return "We are sorry! This is one of those time when even we ourselves are short of words as to what happened, Try restarting";
    }
    if(!context) context = UserContext.NA
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgCreator = (MESSAGES as any)[type][context];
    if(msgCreator){
        return msgCreator(data);
    }
    throw new LiqualityError({errorType: ErrorType.InvalidErrMsgRequest});
}