import { expect, type Locator, type MatcherReturnType } from '@playwright/test';

export const textToBe = async (locator: Locator, expectedText: string, options?: { timeout?: number }): Promise<MatcherReturnType> => {
    let pass: boolean;
    let errorMessage = '';
    let currentText = '';

    try {
        await expect(locator).toHaveText(expectedText, options);

        pass = true;
    } catch (error) {
        pass = false;

        currentText = (await locator.innerText())?.trim() ?? '';

        errorMessage = `Expected text to be: "${expectedText}", but current text is: "${currentText}"`;
    }

    return {
        message: () => errorMessage,
        pass,
        actual: locator,
    };
};
