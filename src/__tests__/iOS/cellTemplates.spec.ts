import { remote, BrowserObject } from 'webdriverio';
import { MobileUtils } from '../mobileUtils';
import { browserstackCapabilities } from '../mobileOptions';
import { config } from '../../test/testEnvConfig';

describe('Cell templates', () => {

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
            },
            logLevel: 'error',
        });
        utils = new MobileUtils(browser, config);
        // await utils.wipeScreenshotsDir();
    });

    beforeEach(async () => {
        await utils.visitBrowserStackLocal();
    });

    afterAll(async () => {
        await browser.pause(3000);
        await browser.deleteSession();
    });

    it('', async () => {

        const title = await browser.getTitle();

        const cell1 = await browser.$('[data-cell-colidx="0"][data-cell-rowidx="14"]');
        const cell2 = await browser.$('[data-cell-colidx="1"][data-cell-rowidx="18"]');

        // await cell1.doubleClick();
        // await utils.openContextMenu(400, 400);

        // await cell1.dragAndDrop(cell2, { // mouse  end with error
        //     duration: 500,
        // });

        // await utils.scrollTo(200, 200, cell1);

        await utils.doubleTap(600, 600);

        // await utils.doubleTap(400, 400);

        const isOpen = await browser.isKeyboardShown();

        console.log(isOpen);

        if (title.includes('ReactGrid')) {
            await utils.testPassed();
        } else {
            await utils.testFailed();
        }

    });

});
