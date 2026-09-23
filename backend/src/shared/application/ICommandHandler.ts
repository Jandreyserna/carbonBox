import { Either } from "../domain";

export interface ICommandHandler<TCommand, TResult> {
    execute(command: TCommand): Promise<Either<Error, TResult>>;
}