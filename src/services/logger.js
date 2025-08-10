// Production-safe logging service
export const logger = {
  info: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },

  success: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${message}`, ...args);
    }
  },

  warn: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },

  error: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.error(`❌ ${message}`, ...args);
    }
  },

  debug: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.debug(`🔍 ${message}`, ...args);
    }
  }
};

export default logger;