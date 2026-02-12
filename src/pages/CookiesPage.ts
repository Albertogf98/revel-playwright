import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CookiesPage extends BasePage {
    private readonly locAcceptCookieButton: Locator;

    constructor(page: Page) {
        super(page);

        this.locAcceptCookieButton = this.getLocator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    }

    public async accept(): Promise<void> {
        await this.click(this.locAcceptCookieButton);
    }
}
