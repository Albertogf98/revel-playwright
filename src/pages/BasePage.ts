import { Locator, Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async goto(path: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' = 'networkidle'): Promise<void> {
        await this.page.goto(path, { waitUntil });
    }

    protected getLocator(locator: string): Locator {
        if (!locator) throw new Error('Locator is not defined');

        return this.page.locator(locator);
    }

    protected async all(locator: Locator): Promise<Locator[]> {
        return await locator.all();
    }

    protected getByTestId(id: string): Locator {
        return this.page.getByTestId(id);
    }

    protected getByText(locator: Locator, text: string): Locator {
        return locator.getByText(text);
    }

    protected getByPosition(locator: Locator, positon: number = 0): Locator {
        return locator.nth(positon);
    }

    protected async getInnerText(locator: Locator): Promise<string> {
        return await locator.innerText();
    }

    protected async click(locator: Locator, delay = 0, force = false): Promise<void> {
        await locator.click({ delay, force });
    }

    protected async waitForState(locator: Locator, state: 'attached' | 'detached' | 'visible' | 'hidden'): Promise<void> {
        await locator.waitFor({ state });
    }
}
