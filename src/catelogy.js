const puppeteer = require('puppeteer');

exports.getCatelogy = async (url) => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, {
      timeout: 300000
    });

    const products = await page.evaluate(() => {
        // const items = Array.from(document.querySelectorAll('.thrv_wrapper.thrv_text_element.tve-froala.fr-box.fr-basic a'));
        const items = Array.from(document.querySelectorAll('.thrv_wrapper.thrv_text_element table tbody tr td a'));
        return items.map(item => {
            return {
                topic: item.innerText,
                urlTopic: item.getAttribute('href')
            }
        });
    });
    console.log(products);
    await browser.close();
    return products;
};