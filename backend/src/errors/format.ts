import { ValidationError as ClassValidationError } from "class-validator";

/**
 * Перетворює масив помилок class-validator у зручний об’єкт.
 *
 * @param {ClassValidationError[]} errors - помилки валідації від class-validator
 * @returns {Record<string, string[]>} - об’єкт виду { "field": ["msg1", "msg2"], ... }
 *
 */
export function formatValidationErrors(errors: ClassValidationError[]) {
    const result: Record<string, string[]> = {};

    /**
     * Рекурсивно обходить дерево помилок.
     * @param err - поточна помилка
     * @param parent - префікс властивості (для вкладених DTO)
     */
    const traverse = (err: ClassValidationError, parent = "") => {
        // будуємо шлях до властивості, напр. "address.street"
        const property = parent ? `${parent}.${err.property}` : err.property;

        // якщо є повідомлення про помилки для цього поля
        if (err.constraints) {
            result[property] = Object.values(err.constraints);
        }

        // рекурсія для вкладених дочірніх DTO
        if (err.children?.length) {
            err.children.forEach(child => traverse(child, property));
        }
    };

    errors.forEach(e => traverse(e));
    return result;
}
