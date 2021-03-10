/// <reference types="jest" />
import cypressJson from '../../cypress.json';
import { TestConfig } from '../test/testEnvConfig';
import { BrowserObject, Element } from 'webdriverio';

export interface CellLocation {
    idx: number;
    idy: number;
}

export class MobileUtils {

    private lastAssertionResult: 'passed' | 'failed' | undefined;
    public static BASE_URL = cypressJson.baseUrl;
    public static REMOTE_BROSERSTACK_BASE_URL = `${process.env.PROTOCOL}://bs-local.com:${process.env.PORT}`;

    constructor(
        protected browser: BrowserObject,
        protected config: TestConfig,
    ) { }

    getConfig(): TestConfig {
        return this.config;
    }

    async visitBrowserStackLocal(path = ''): Promise<void> {
        await this.browser.url(MobileUtils.REMOTE_BROSERSTACK_BASE_URL + path);
    }

    async runAssertion(
        assertion: () => any,
        onFailure?: () => any,
    ) {
        try {
            await assertion();
            this.lastAssertionResult = 'passed';
        } catch (exception) {
            if (typeof onFailure === 'function') {
                await onFailure();
            }
            if (this.isTestProd()) {
                await this.browser.deleteSession();
            }
            this.lastAssertionResult = 'failed';
            throw exception;
        }
    }

    isTestProd(): boolean {
        return process.env.TEST_PROD === 'true';
    }

    async getScroll(): Promise<{ scrollLeft: number, scrollTop: number }> {
        return await this.browser.execute(() => {
            const e = document.getElementsByClassName('test-grid-container')[0];
            return { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop };
        });
    }

    async scrollTo(x: number, y: number, element: Element) {
        await this.browser.touchScroll( // ??
            x,
            y,
            element.elementId
        );
    }

    async testPassed(msg = '') {
        await this.browser.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "${msg}"}}`);
    }

    async testFailed(msg = '') {
        await this.browser.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "${msg}"}}`);
    }

    async getCell({ idx, idy }: CellLocation): Promise<Element> {
        return await this.browser.$(`[data-cell-colidx="${idx}"][data-cell-rowidx="${idy}"]`);
    }

    async sendKeys(value: string | string[]): Promise<void> {
        try {
            await this.browser.keys(value);
        } catch (error) { }
    }

    async tap(x: number, y: number): Promise<void> {
        await this.browser.touchAction({
            action: 'tap',
            x,
            y,
        });
    }

    async getCellEditor(): Promise<Element> {
        return await this.browser.$('.rg-cell.rg-celleditor');
    }

    async waitForCellEditor(): Promise<void> {
        await this.browser.waitUntil(
            async () => await (await this.getCellEditor()).isExisting(),
            {
                timeout: 2000,
                timeoutMsg: 'Cell editor not found'
            }
        );
    }

    async dragAndDrop(x: number, y: number, xOffset: number, yOffset: number) {
        await this.browser.touchAction([
            { action: 'press', x, y },
            { action: 'moveTo', x: x + xOffset, y: y + yOffset },
            { action: 'release' },
        ]);
    }

    async runner(testBody: () => void) {
        try {
            const title = await this.browser.getTitle();
            await this.runAssertion(async () => {
                try {
                    expect(title).toContain('ReactGrid');
                } catch (error) {
                    throw Error(`Couldn't load ReactGrid page to continue testing!`);
                }
            });
            await testBody();
            await this.testPassed();
        } catch (error) {
            await this.testFailed();
            throw error;
        }
    }

    async doubleTap(x: number, y: number) {
        await this.tap(x, y);
        await this.tap(x, y);
    }

    async openContextMenu(x: number, y: number) {
        await this.browser.touchAction([
            { action: 'press', x, y, },
            { action: 'wait', ms: 800, },
            { action: 'release', },
        ]);
    }

}
