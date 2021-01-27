import { Builder, ThenableWebDriver } from 'selenium-webdriver';
import { Utils } from '../utils';
import { browserstackCapabilities, browserstackURL, IpadCapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';
import { remote, } from 'webdriverio';

describe('Cell templates', () => {

    let driver: ThenableWebDriver;
    let utils: Utils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        driver = new Builder()
            .forBrowser('chrome')
            .usingServer(browserstackURL)
            .withCapabilities(IpadCapabilities)
            .build();
        utils = new Utils(driver, config, 'mobileIPad');
        await utils.wipeScreenshotsDir();
    });

    beforeEach(async () => {
        // await utils.visitBrowserStackLocal();
    });

    afterAll(async () => {
        const nonProductionAndSuccess = !utils.isTestProd() && utils.isLastAsserionPassed();
        if (nonProductionAndSuccess) {
            if (await (await driver.getSession()).getId()) {
                await driver.close();
                await driver.quit();
            }
        }
    });

    it('pick new date in DateCell', async () => {

        const browser = await remote({
            logLevel: 'error',
            path: '/', // remove `path` if you decided using something different from driver binaries.
            capabilities: {
                browserName: 'chrome'
                // ...IpadCapabilities as any
            },
            user: 'bsuser7502154679',
            // key: process.env.BROWSERSTACK_ACCESS_KEY,
            key: 'F43JQwzutvrH4ef8spn9',
        })
        await browser.url('https://webdriver.io')

        const title = await driver.getTitle();



        // Setting the status of test as 'passed' or 'failed' based on the condition; if title of the web page included 'BrowserStack'
        if (title.includes('ReactGrid MIT')) {
            await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains ReactGrid MIT!"}}');
        } else {
            await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Title does not contain ReactGrid MIT!"}}');
        }

    });

});
