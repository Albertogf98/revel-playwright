import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CarPage extends BasePage {
    private readonly moreFilterButton: Locator;
    private readonly carCards: Locator;
    private readonly carNotFoundCards: Locator;

    constructor(page: Page) {
        super(page);

        this.moreFilterButton = this.getLocator('div[class *= ShortcutsFilterBar_fixedFilter] svg');

        this.carCards = this.getLocator('div[class *= Grid_grid__card--desktop] li[class *= Card]');

        this.carNotFoundCards = this.getLocator('article[class *= CarCard_card__notFound]');
    }

    public async goto(): Promise<void> {
        await super.goto(process.env.PATH_CARS!);
    }

    public async openFilters(): Promise<void> {
        await this.click(this.moreFilterButton);
    }

    public async getNumberOfCards(): Promise<number> {
        return await this.carCards.count();
    }

    public async waitUntilCardsAppear(): Promise<void> {
        await this.waitForState(this.carCards, 'visible');
    }

    public async waitUntilNotFoundCardAppear(): Promise<void> {
        await this.waitForState(this.carNotFoundCards, 'visible');
    }

    get notFoundCards(): Locator {
        return this.carNotFoundCards;
    }
}
