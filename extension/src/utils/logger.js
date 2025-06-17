export const log = {
    info: (message, ...args) => {
        console.log(`[MyVibe Extension] ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[MyVibe Extension ERROR] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[MyVibe Extension WARN] ${message}`, ...args);
    }
}; 