import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CarFilters {
    fuel?: FuelType;
    type?: CarType;
    brand?: string;
}

export type FuelType = 'Diesel' | 'Eléctrico' | 'Híbrido enchufable' | 'Gasolina' | 'Híbrido';

export type CarType = 'Compacto' | 'Coupe' | 'Familiar' | 'SUV';

export class FilterGridPage extends BasePage {
    private readonly fuelOptions: Locator;
    private readonly genericOptions: Locator;
    private readonly showResultsButton: Locator;
    private readonly resetButton: Locator;

    constructor(page: Page) {
        super(page);

        this.fuelOptions = this.getLocator('ul > li > div > p');

        this.genericOptions = this.getLocator('ul > li > p');

        const buttons = this.getLocator('div[class *= FilterAside_aside] button');
        this.showResultsButton = this.getByPosition(buttons, 1);
        this.resetButton = this.getByPosition(buttons, 0);
    }

    private async selectFuel(value: FuelType): Promise<void> {
        await this.click(this.fuelOptions.getByText(value, { exact: true }));
    }

    private async selectGenericOption(value: string): Promise<void> {
        await this.click(this.genericOptions.getByText(value, { exact: true }));
    }

    public async applyFilters(): Promise<void> {
        await this.click(this.showResultsButton);
    }

    public async resetFilters(): Promise<void> {
        await this.click(this.resetButton);
    }

    public async apply({ fuel, type, brand }: CarFilters, showFilterResult: boolean = true): Promise<void> {
        await Promise.all([
            fuel && this.selectFuel(fuel),
            type && this.selectGenericOption(type),
            brand && this.selectGenericOption(brand),
        ]);

        showFilterResult && (await this.applyFilters());
    }

    public async getShowButtonText(): Promise<string> {
        return await this.getInnerText(this.showResultsButton);
    }

    get showButton(): Locator {
        return this.showResultsButton;
    }
}
