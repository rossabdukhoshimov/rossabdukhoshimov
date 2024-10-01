require('dotenv').config({
    path: process.env.TEST_ENV ? `.env.qa` : '.env.local',
    override: process.env.TEST_ENV ? true : false,
});

require('fs-extra').ensureDir('../test-results/reports');
require('fs-extra').remove('../test-results/screenshots');
require('fs-extra').remove('../test-results/videos');
require('fs-extra').remove('../test-results/logs');

let options = [
    '--require-module ts-node/register',
    '--require ../api/steps/*.ts',
    '--require ../web/steps/*.ts',
    '--require support/**/*.ts',
    '--format rerun:@rerun.txt',
    `--format-options '{"snippetInterface":"async-await"}'`,
    `--retry=${process.env.RETRIES ?? 1}`,
    `--tags "not @ignore"`,
].join(' ');

let runner = [
    '../../**/*.feature',
    options,
    `--parallel=${process.env.PARALLEL_THREAD ?? 3}`,
    '--format json:../test-results/reports/cucumber-report.json',
    '--format html:../test-results/reports/cucumber-report.html'
].join(' ');

let rerun = [
    '@rerun.txt',
    options,
    '--format json:../test-results/reports/rerun-cucumber-report.json',
    '--format html:../test-results/reports/rerun-cucumber-report.html'
].join(' ');

let no_thread = [
    '../../**/*.feature',
    options,
    `--parallel=1`,
    '--format json:../test-results/reports/no-thread-cucumber-report.json',
    '--format html:../test-results/reports/no-thread-cucumber-report.html'
].join(' ');

module.exports = { runner, rerun, no_thread }
