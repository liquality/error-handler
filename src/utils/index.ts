import { LiqualityError } from "../liquality-error";

export function isLiqualityError(error: unknown): boolean {
    return error instanceof LiqualityError;
}