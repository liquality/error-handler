import { LiqualityError } from "../liquality-error";

export function reportToConsole<SourceError>(error: LiqualityError<SourceError>){
    console.log(error);
}