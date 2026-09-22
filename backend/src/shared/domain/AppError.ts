export abstract class AppError extends Error {
    abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    readonly statusCode = 400;
}

export class NotFoundError extends AppError {
    readonly statusCode = 404;
}

export class ConflictError extends AppError {
    readonly statusCode = 409;
}
