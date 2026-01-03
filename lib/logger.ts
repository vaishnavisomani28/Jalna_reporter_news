/**
 * Centralized logging utility
 * In production, this should integrate with a logging service (Sentry, LogRocket, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error;
  metadata?: Record<string, any>;
  timestamp: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    let message = `[${timestamp}] ${level} ${entry.message}`;

    if (entry.error) {
      message += `\nError: ${entry.error.message}`;
      if (entry.error.stack && this.isDevelopment) {
        message += `\nStack: ${entry.error.stack}`;
      }
    }

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      message += `\nMetadata: ${JSON.stringify(entry.metadata, null, 2)}`;
    }

    return message;
  }

  private log(level: LogLevel, message: string, error?: Error, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      error,
      metadata,
      timestamp: new Date().toISOString(),
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        // In production, send to error tracking service
        // Example: Sentry.captureException(error || new Error(message), { extra: metadata });
        break;
      case 'warn':
        if (this.isDevelopment) {
          console.warn(formattedMessage);
        }
        break;
      case 'info':
        if (this.isDevelopment) {
          console.info(formattedMessage);
        }
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, undefined, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, undefined, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log('error', message, error, metadata);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', message, undefined, metadata);
  }
}

export const logger = new Logger();

