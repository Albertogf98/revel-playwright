import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import chalk from 'chalk';
import { DateUtil } from '../utils/DateUtil';

export type StatusKey = 'passed' | 'failed' | 'timedOut' | 'interrupted';
export type StatusInfo = { color: chalk.Chalk; tests: string[] };

class TimestampedReporter implements Reporter {
    private readonly SEPARATOR = '==================================================================================';

    private readonly dateUtil;

    private totalTests = 0;

    private readonly STATUS: Record<StatusKey, StatusInfo> = {
        passed: { color: chalk.green, tests: [] },
        failed: { color: chalk.red, tests: [] },
        timedOut: { color: chalk.yellow, tests: [] },
        interrupted: { color: chalk.gray, tests: [] },
    };

    constructor() {
        this.dateUtil = new DateUtil();
    }

    async onBegin(_: FullConfig, suite: Suite) {
        this.totalTests = suite.allTests().length;

        console.log(this.SEPARATOR);
        this.log(`Starting the run with ${this.totalTests} tests`);
        console.log(this.SEPARATOR);
    }

    onTestBegin({ title }: TestCase) {
        this.log(`Starting test: ${title}`);
    }

    onTestEnd({ title }: TestCase, result: TestResult) {
        const status = result.status as StatusKey;
        if (status in this.STATUS) {
            const { color, tests } = this.STATUS[status];
            tests.push(title);
            this.log(`Finished test: ${title} - ${color(status.toUpperCase())}`);
        }
    }

    async onEnd({ duration }: FullResult) {
        this.log(`Finished all the tests run.`);

        Object.entries(this.STATUS)
            .filter(([_, status]) => status.tests.length > 0)
            .forEach(([status, { color, tests }]) => {
                console.log(color(this.SEPARATOR));
                console.log(color(`Test ${status}: ${tests.length}`));
                console.log(color(this.SEPARATOR));
                tests.forEach((test: string) => console.log(color(test)));
            });
    }

    private log(message: string) {
        console.log(`[${this.dateUtil.getTimestamp()}] ${message}`);
    }
}

export default TimestampedReporter;
