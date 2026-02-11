type LogData = Record<string, unknown>;

type LogLevel = "info" | "warn" | "error";

const DEFAULT_FIELDS: LogData = {
  client_request_id: null,
  server_request_id: null,
  method: null,
  url: null,
  status: null,
  duration_ms: null,
};

const SECRET_KEY_PATTERN = /password|authorization|token/i;

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => redact(entry));
  }

  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      if (SECRET_KEY_PATTERN.test(key)) {
        output[key] = "[REDACTED]";
      } else {
        output[key] = redact(entry);
      }
    });
    return output;
  }

  return value;
}

function buildLogData(data?: LogData): LogData {
  const merged: LogData = {
    timestamp: new Date().toISOString(),
    ...DEFAULT_FIELDS,
    ...(data ?? {}),
  };

  return redact(merged) as LogData;
}

function log(level: LogLevel, id: string, msg: string, data?: LogData) {
  const payload = buildLogData(data);
  const line = `[FE_LOG_ID:${id}] ${msg}`;
  if (level === "warn") {
    console.warn(line, payload);
  } else if (level === "error") {
    console.error(line, payload);
  } else {
    console.log(line, payload);
  }
}

export function logInfo(id: string, msg: string, data?: LogData) {
  log("info", id, msg, data);
}

export function logWarn(id: string, msg: string, data?: LogData) {
  log("warn", id, msg, data);
}

export function logError(id: string, msg: string, data?: LogData) {
  log("error", id, msg, data);
}
