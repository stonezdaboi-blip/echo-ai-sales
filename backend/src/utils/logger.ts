enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private level: string;

  constructor(name: string) {
    this.level = process.env.LOG_LEVEL || 'info';
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };

    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, data?: any) {
    if (['debug', 'info', 'warn', 'error'].includes(this.level)) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: any) {
    if (['info', 'warn', 'error'].includes(this.level)) {
      this.log(LogLevel.INFO, message, data);
    }
  }

  warn(message: string, data?: any) {
    if (['warn', 'error'].includes(this.level)) {
      this.log(LogLevel.WARN, message, data);
    }
  }

  error(message: string, error?: Error) {
    this.log(LogLevel.ERROR, message, {
      error: error?.message,
      stack: error?.stack,
    });
  }
}

export default Logger;
