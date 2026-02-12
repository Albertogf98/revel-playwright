import { expect } from '@playwright/test';
import { Tags } from '../src/constants/tag.enum';
import { CarFilters } from '../src/pages/FilterGridPage';
import test from '../src/fixtures/fixture';

test.describe('Car Filters', { tag: [Tags.WEB, Tags.FILTER] }, () => {
    test.beforeEach(async ({ carPage, acceptCookies }) => {
        await carPage.goto();
        await acceptCookies();
        await carPage.openFilters();
    });

    test('should filter cars by fuel and type', { tag: '@revel-00' }, async ({ carPage, filterGridPage }) => {
        const filters: CarFilters = {
            fuel: 'Gasolina',
            type: 'Compacto',
        };

        const initialCount = await carPage.getNumberOfCards();

        await filterGridPage.apply(filters);

        const filteredCount = await carPage.getNumberOfCards();
        expect(filteredCount).toBeLessThan(initialCount);
    });

    test(
        'should show empty state when filters return no results',
        { tag: '@revel-01' },
        async ({ filterGridPage, carPage }) => {
            await filterGridPage.apply(
                {
                    fuel: 'Gasolina',
                    type: 'Compacto',
                    brand: 'Kia',
                },
                false,
            );

            await carPage.waitUntilNotFoundCardAppear();
            await expect(carPage.notFoundCards).toBeAttached();
        },
    );

    test(
        'should reset filters and restore initial results',
        { tag: '@revel-02' },
        async ({ carPage, filterGridPage }) => {
            const initialCount = await carPage.getNumberOfCards();

            await filterGridPage.apply({ fuel: 'Gasolina' });

            await carPage.openFilters();
            await filterGridPage.resetFilters();
            await filterGridPage.applyFilters();

            const finalCount = await carPage.getNumberOfCards();
            expect(finalCount).toBe(initialCount);
        },
    );
});
