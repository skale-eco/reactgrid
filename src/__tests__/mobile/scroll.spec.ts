/// <reference types="jest" />
import { remote, BrowserObject } from 'webdriverio';
import { MobileUtils } from '../mobileUtils';
import { androidTabletCapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe('Scroll', () => {

    let browser: BrowserObject;
    let utils: MobileUtils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        browser = await remote({
            user: process.env.USERNAME,
            key: process.env.BROWSERSTACK_ACCESS_KEY,
            capabilities: {
                ...androidTabletCapabilities,
                logLevel: 'error',
                name: 'Mobile scroll'
            },
            logLevel: 'error',
        });
        utils = new MobileUtils(browser, config);
    });

    beforeEach(async () => {
        await utils.visitBrowserStackLocal();
    });

    afterAll(async () => {
        await browser.pause(3000);
        await browser.deleteSession();
    });

    it.skip('should NOT scroll when focused cell is dragged', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('sticky should be rendered on top', async () => {
        throw new Error(`Test not implemented!`);
    });

    it.skip('virtual scroll should work on sticky pinned to body and rerender view', async () => {
        throw new Error(`Test not implemented!`);
    });

});
