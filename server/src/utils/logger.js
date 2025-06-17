const log = {
    info: (message, ...args) => {
        console.log(`[MyVibe Server] ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[MyVibe Server ERROR] ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[MyVibe Server WARN] ${message}`, ...args);
    }
};

module.exports = { log }; 