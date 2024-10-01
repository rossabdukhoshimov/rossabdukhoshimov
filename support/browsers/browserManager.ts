
import { chromium, firefox, webkit, LaunchOptions } from "@playwright/test";

const browserOptions: LaunchOptions = {
    slowMo: 50,
    args: ["--start-maximized", "--disable-extensions", "--disable-plugins"],
    firefoxUserPrefs: {
        'media.navigator.streams.fake': true,
        'media.navigator.permission.disabled': true,
    },
    headless: true,
    downloadsPath: "../test-results/downloads",
}

const apiBrowserOptions: LaunchOptions = {
    headless: true
}

export const invokeBrowser = () => {
    const browserType = process.env.BROWSER
    switch (browserType) {
        case "chrome":
            return chromium.launch(browserOptions);
        case "firefox":
            return firefox.launch(browserOptions);
        case "webkit":
            return webkit.launch(browserOptions);
        default:
            return chromium.launch(apiBrowserOptions);
    }

}
