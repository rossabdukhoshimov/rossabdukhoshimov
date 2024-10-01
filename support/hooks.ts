import { BeforeAll, Before, AfterAll, After, setDefaultTimeout, ITestCaseHookParameter, Status, formatterHelpers } from '@cucumber/cucumber'
import { type Browser, BrowserContext, request } from '@playwright/test'
import { invokeBrowser } from './browsers/browserManager'
import UIActions from "./playwright/ui-actions/UIActions";
import Log from "./logger/Log";
import RESTRequest from "./playwright/api/RESTRequest";
import fse from "fs-extra";
import * as fs from 'node:fs'

let browser: Browser
let context: BrowserContext
const timeInMin: number = 60 * 1000;
setDefaultTimeout(Number.parseInt(process.env.TEST_TIMEOUT, 10) * timeInMin);


BeforeAll(async function () {
    browser = await invokeBrowser()
})


// Create a new browser context and page per scenario
Before(async function ({ pickle, gherkinDocument }: ITestCaseHookParameter) {
    const { line } = formatterHelpers.PickleParser.getPickleLocation({ gherkinDocument, pickle })
    Log.testBegin(`${pickle.name}: ${line}`);
    if(process.env.BROWSER){
        this.context = await browser.newContext({
        viewport: null,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        recordVideo: process.env.RECORD_VIDEO === "true" ? { dir: '../test-results/videos' } : undefined,
        })
    }else{
        this.context = await browser.newContext({
            baseURL: process.env.BASEURL
        })
    }
    this.page = await this.context?.newPage();
    this.web = new UIActions(this.page);
    this.rest = new RESTRequest(this.page);
});

// Cleanup after each scenario
After(async function ({ result, pickle, gherkinDocument }: ITestCaseHookParameter) {
    const { line } = formatterHelpers.PickleParser.getPickleLocation({ gherkinDocument, pickle })
    const status = result.status;
    const scenario = pickle.name;
    if(process.env.BROWSER){
        const videoPath = await this.page?.video()?.path();
        if (status === Status.FAILED) {
            const image = await this.page?.screenshot({ path: `../test-results/screenshots/${scenario} (${line}).png`, fullPage: true });
            await this.attach(image, 'image/png');
            Log.error(`${scenario}: ${line} - ${status}\n${result.message}`);
        }
        await this.page?.close();
        await this.context?.close();
        if (process.env.RECORD_VIDEO === "true") {
            if (status === Status.FAILED) {
                await fse.renameSync(videoPath, `../test-results/videos/${scenario}(${line}).webm`);
                await this.attach(fse.readFileSync(`../test-results/videos/${scenario}(${line}).webm`), 'video/webm');
            } else {
                fse.unlinkSync(videoPath);
            }
        }
    }else{
        await this.page?.close();
        await this.context?.close();
    }
    Log.testEnd(`${scenario}: ${line}`, status);
});

AfterAll(async function () {
    await browser.close()

})
