import { Either } from "../domain";

export interface IQueryHandler<TQuery, TResult> {
    execute(query: TQuery): Promise<Either<Error, TResult>>;
}