

import winston from 'winston'

// Link - https://stackoverflow.com/questions/44952938/get-line-number-and-filename-for-a-log-output
// ALternative - https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342


// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

/**
 * Use CallSite to extract filename and number, for more info read: https://v8.dev/docs/stack-trace-api#customizing-stack-traces
 * @returns {string} filename and line number separated by a colon
 */

const PROJECT_PATH = "/home/wsl-tom/git/side-projects/2d-shooter-2020-nengi-phaser-demo/server/src"

const getFileNameAndLineNumber = () => {
  const oldStackTrace = Error.prepareStackTrace;
  try {
        // Important, default is only 10, which may not contain the file you're after
        Error.stackTraceLimit = Infinity;
        // eslint-disable-next-line handle-callback-err
        Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
        Error.captureStackTrace(this);

        // in this example I needed to "peel" the first CallSites in order to get to the caller we're looking for
        // in your code, the number of stacks depends on the levels of abstractions you're using
        // in my code I'm stripping frames that come from logger module and winston (node_module)
        //@ts-ignore
        const callSite = this.stack.find(line => line.getFileName().indexOf('/logger') < 0 && line.getFileName().indexOf('/node_modules/') < 0);

        // Shouldn't happen - but we'll just return unknown instead of erroring, trying to getFileName() on a null callsite
        if (!callSite) {
          return "UNKNOWN FILENAME"
        }
        return callSite.getFileName().replace(PROJECT_PATH, "") + ':' + callSite.getLineNumber();
    } finally {
        Error.prepareStackTrace = oldStackTrace;
    }
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors)

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
//   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.timestamp({ format: 'HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `[${info.level} - ${info.timestamp} (${getFileNameAndLineNumber()})] - ${info.message}`,
    ),


)

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console(),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Allow to print all the error message inside the all.log file
  // (also the error log that are also printed inside the error.log(
  new winston.transports.File({ filename: 'logs/all.log' }),
]

// Create the logger instance that has to be exported
// and used to log messages.
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

export default Logger