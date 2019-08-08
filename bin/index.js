#!/usr/bin/env node

const minimist = require('minimist');
const CLIEngine = require('eslint').CLIEngine;
const path = require('path');
const chalk = require('chalk');

module.exports = (() => {
  const args = minimist(process.argv.slice(2));
  let configPath = path.resolve(__dirname, '../.eslintrc.js');
  let config = require(configPath);

  if (args.conf) {
    try {
      configPath = path.resolve(process.cwd(), args.conf);
      config = require(configPath);
    } catch (error) {
      return console.log(error);
    }
  } else {
    try {
      configPath = path.resolve(process.cwd(), '.eslintrc.js');
      config = require(configPath);
    } catch (error) {
      return console.log(error);
    }
  }

  console.log(`> eslint has loaded config from: ${configPath}`);

  const cli = new CLIEngine(config);
  let filesDir = [];

  if (args.dir) {
    filesDir = []
      .concat(args.dir)
      .map((item) => path.resolve(process.cwd(), item));
  } else {
    filesDir = ['./']
  }

  console.log(`> eslint is checking the following dir: ${filesDir}`);

  const report = cli.executeOnFiles(filesDir);

  if (report.errorCount > 0) {
    const formatter = cli.getFormatter();

    console.log(chalk.bold.redBright(`> eslint has found ${report.errorCount} error(s)`));
    console.log(formatter(report.results));

    return;
  }

  console.log(chalk.bold.greenBright('> eslint finished without any errors!'));
})();
