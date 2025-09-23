export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict: Resource already exists') {
        super(message, 409);
    }
}

export class ValidationError extends AppError {
    details?: Record<string, string[]>;

    constructor(message = 'Validation failed', details?: Record<string, string[]>) {
        super(message, 400);
        this.details = details;
    }
}