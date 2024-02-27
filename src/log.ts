import chalk from 'chalk';

export type TLogType = 'LOG' | 'INFO' | 'WARN' | 'ERROR';

export function log(type: TLogType, category: string, message: string | object) {
  const msg = typeof message == 'string' ? message : JSON.stringify(message);
  const time = new Date().toISOString();
  const section = `(${category.toLowerCase()})`;
  const tag = `[${type}:${time}]`;
  switch (type) {
    case 'LOG':
      console.log(chalk.bgGreen(tag), chalk.green(section, msg));
      break;
    case 'INFO':
      console.log(chalk.bgBlue(tag), chalk.blue(section, msg));
      break;
    case 'WARN':
      console.log(chalk.bgYellowBright(tag), chalk.yellowBright(section, msg));
      break;
    case 'ERROR':
      console.log(chalk.bgRed(tag), chalk.red(section, msg));
      break;
    default:
      console.log(tag, ' ', section, ' ', msg);
      break;
  }
}
