import { ValidationError as ClassValidationError } from "class-validator";

export function formatValidationErrors(errors: ClassValidationError[]) {
    const result: Record<string, string[]> = {};

    const traverse = (err: ClassValidationError, parent = "") => {
        const property = parent ? `${parent}.${err.property}` : err.property;
        if (err.constraints) {
            result[property] = Object.values(err.constraints);
        }
        if (err.children?.length) {
            err.children.forEach(child => traverse(child, property));
        }
    };

    errors.forEach(e => traverse(e));
    return result;
}
