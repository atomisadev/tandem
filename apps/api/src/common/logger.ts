const colors = {
  red: (msg: string | number) => `\x1b[31m${msg}\x1b[0m`,
  green: (msg: string | number) => `\x1b[32m${msg}\x1b[0m`,
  yellow: (msg: string | number) => `\x1b[33m${msg}\x1b[0m`,
  blue: (msg: string | number) => `\x1b[34m${msg}\x1b[0m`,
  gray: (msg: string | number) => `\x1b[90m${msg}\x1b[0m`,
  bold: (msg: string | number) => `\x1b[1m${msg}\x1b[0m`,
};

export const Logger = {
  error: (message: string, error?: unknown) => {
    const errString = error instanceof Error ? error.stack : String(error);
    console.log(
      `${colors.red("error")} - ${message}\n${colors.gray(errString!)}`,
    );
  },

  warn: (message: string) => {
    console.log(`${colors.yellow("warn")} - ${message}`);
  },

  info: (message: string) => {
    console.log(`${colors.blue("info")} - ${message}`);
  },

  http: (method: string, url: string, status: number, duration: string) => {
    const statusColor =
      status >= 500
        ? colors.red
        : status >= 400
          ? colors.yellow
          : status >= 300
            ? colors.blue
            : colors.green;

    console.log(
      `${colors.gray(`[${new Date().toLocaleTimeString()}]`)} ${colors.bold(method)} ${url} ${statusColor(status)} ${colors.gray(`(${duration})`)}`,
    );
  },
};
