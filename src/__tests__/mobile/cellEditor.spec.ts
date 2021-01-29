import { remote, BrowserObject } from 'webdriverio';
import { MobileUtils } from '../mobileUtils';
import { browserstackCapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe('Cell editor', () => {

    let browser: BrowserObject;
    let utils: MobileUtils;

    jest.setTimeout(30000);

    beforeAll(async () => {
        browser = await remote({
            user: process.env.USERNAME,
            key: process.env.BROWSERSTACK_ACCESS_KEY,
            capabilities: {
                ...browserstackCapabilities,
                logLevel: 'error',
                'name': 'Cell editor',
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

    it('should be rendered inside cell', async () => {
        await utils.runner(async () => {

            await utils.tap(600, 1200);
            await utils.sendKeys('text');

            await utils.waitForCellEditor();

            const cellEditor = await utils.getCellEditor();

            const cellEditorText = await (await cellEditor.$('input')).getValue();

            await utils.runAssertion(async () => {
                expect(cellEditorText).toBe('text');
            });

        });
    });

    it('should be visible when keyboard could cover them', async () => {
        await utils.runner(async () => {

            await utils.tap(600, 1100);
            await utils.sendKeys('text');

            await utils.waitForCellEditor();

            const isKeyboardShown = await browser.isKeyboardShown();

            await utils.runAssertion(async () => {
                expect(isKeyboardShown).toBe(true);
            });

            const cellEditor = await utils.getCellEditor();

            await utils.runAssertion(async () => {
                expect(await cellEditor.isDisplayedInViewport()).toBe(true);
            });

        });
    });

    it.only('should NOT be able to scroll view if started move finger on focused cell', async () => {
        await utils.runner(async () => {
            const startX = 400,
                startY = 600;

            await utils.tap(startX, startY);

            const { scrollLeft, scrollTop } = await browser.execute(() => {
                const e = document.getElementsByClassName('test-grid-container')[0];
                return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
            });

            console.log({ scrollLeft, scrollTop });

            // const cellEditor = await utils.getCellEditor()

            await utils.dragAndDrop(startX + 300, startY, -400, 0);
        });
    });

    it.skip('', async () => {
        await utils.runner(async () => {
            // await browser.url('http://reactgrid.com/');
        });
    })

});
