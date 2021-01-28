import cypressJson from '../../cypress.json';
import { TestConfig } from '../test/testEnvConfig';
import { BrowserObject, Element } from 'webdriverio';

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

    async scrollTo(x: number, y: number, element: Element) {
        await this.browser.touchScroll( // ??
            200,
            200,
            element.elementId
        );
    }

    async testPassed(msg = '') {
        await this.browser.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "${msg}"}}`);
    }

    async testFailed(msg = '') {
        await this.browser.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "${msg}"}}`);
    }

    async tap(x: number, y: number) {
        await this.browser.touchAction({// touch
            action: 'tap',
            x,
            y,
        })
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
