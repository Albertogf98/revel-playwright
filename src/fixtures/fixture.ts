import base from '@playwright/test';
import { CarPage } from '../pages/CarPage';
import { FilterGridPage } from '../pages/FilterGridPage';
import { CookiesPage } from '../pages/CookiesPage';

interface PageFixture {
    acceptCookies: () => Promise<void>;
    carPage: CarPage;
    filterGridPage: FilterGridPage;
    selectFilter: (filter: any) => Promise<void>;
}

const test = base.extend<PageFixture>({
    page: async ({ browser }, use) => {
        const page = await browser.newPage();
        await use(page);
    },

    acceptCookies: async ({ page }, use) => {
        await use(async () => {
            await new CookiesPage(page).accept();
        });
    },

    carPage: async ({ page }, use) => {
        await use(new CarPage(page));
    },

    filterGridPage: async ({ page }, use) => {
        await use(new FilterGridPage(page));
    },
});

test.afterEach(async ({ context }) => {
    await context.close();
});

export default test;
