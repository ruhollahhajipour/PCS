export type LogLevel =
  | "info"
  | "warning"
  | "error"
  | "debug";

class LoggerService {
  private enabled = true;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  log(
    level: LogLevel,
    message: string,
    ...args: unknown[]
  ) {
    if (!this.enabled) return;

    const time = new Date().toLocaleString();

    switch (level) {
      case "info":
        console.info(
          `[INFO] ${time} - ${message}`,
          ...args
        );
        break;

      case "warning":
        console.warn(
          `[WARNING] ${time} - ${message}`,
          ...args
        );
        break;

      case "error":
        console.error(
          `[ERROR] ${time} - ${message}`,
          ...args
        );
        break;

      case "debug":
      default:
        console.log(
          `[DEBUG] ${time} - ${message}`,
          ...args
        );
        break;
    }
  }

  info(
    message: string,
    ...args: unknown[]
  ) {
    this.log("info", message, ...args);
  }

  warning(
    message: string,
    ...args: unknown[]
  ) {
    this.log("warning", message, ...args);
  }

  error(
    message: string,
    ...args: unknown[]
  ) {
    this.log("error", message, ...args);
  }

  debug(
    message: string,
    ...args: unknown[]
  ) {
    this.log("debug", message, ...args);
  }
}

const logger = new LoggerService();

export default logger;