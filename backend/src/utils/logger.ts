import { LoggerService } from '@nestjs/common';

export class StructuredLogger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, meta?: Record<string, unknown>) {
    this.write('info', message, meta);
  }

  error(message: string, trace?: string, meta?: Record<string, unknown>) {
    this.write('error', message, { ...meta, trace });
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.write('warn', message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.write('debug', message, meta);
  }

  verbose(message: string, meta?: Record<string, unknown>) {
    this.write('verbose', message, meta);
  }

  private write(
    level: string,
    message: string,
    meta?: Record<string, unknown>,
  ) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...meta,
    };
    console.log(JSON.stringify(entry));
  }
}

export const SENSITIVE_FIELDS = ['password', 'token', 'authorization'];

export function redactSensitive(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      redacted[key] = redactSensitive(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
}
