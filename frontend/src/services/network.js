import * as Network from 'expo-network';

/**
 * Перевіряє наявність інтернет-з'єднання.
 *
 * @async
 * @returns {Promise<boolean>} true, якщо пристрій підключений до мережі та має доступ до інтернету.
 *
 * Логіка:
 * - Використовує `expo-network` для отримання стану мережі
 * - Перевіряє `isConnected` (чи є підключення) і `isInternetReachable` (чи доступний інтернет)
 *
 * Якщо виникає помилка при перевірці → повертає false.
 */
export async function isOnline() {
    try {
        const s = await Network.getNetworkStateAsync();
        return !!s.isConnected && s.isInternetReachable === true;
    } catch {
        return false;
    }
}
