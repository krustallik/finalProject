/**
 * Базовий клас для всіх кастомних помилок у додатку.
 * Наслідує стандартний Error і додає поле `statusCode`.
 */
export class AppError extends Error {
    statusCode: number;

    /**
     * @param {string} message - повідомлення про помилку
     * @param {number} [statusCode=500] - HTTP статус код
     */
    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

/**
 * Помилка 404 — ресурс не знайдено.
 */
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * Помилка 409 — конфлікт (наприклад, дублювання email).
 */
export class ConflictError extends AppError {
    constructor(message = 'Conflict: Resource already exists') {
        super(message, 409);
    }
}

/**
 * Помилка 400 — валідація не пройдена.
 * Додатково містить деталі у вигляді об’єкта { field: [messages...] }.
 */
export class ValidationError extends AppError {
    details?: Record<string, string[]>;

    constructor(message = 'Validation failed', details?: Record<string, string[]>) {
        super(message, 400);
        this.details = details;
    }
}
