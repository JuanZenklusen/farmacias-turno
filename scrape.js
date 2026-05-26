const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(
        'https://circulorafaela.com.ar/farmacias',
        {
            waitUntil: 'networkidle2',
            timeout: 0
        }
    );

    await page.waitForSelector('.widget-farmacia');

    const farmacias = await page.evaluate(() => {

        return [...document.querySelectorAll('.widget-farmacia')]
            .map(f => ({

                nombre:
                    f.querySelector('.titulo')
                    ?.innerText
                    ?.trim(),

                telefono:
                    f.querySelector('.telefono')
                    ?.innerText
                    ?.trim(),

                direccion:
                    f.querySelector('.direccion')
                    ?.innerText
                    ?.trim()
            }));
    });

    fs.writeFileSync(
        'farmacias.json',
        JSON.stringify(farmacias, null, 2)
    );

    console.log(farmacias);

    await browser.close();

})();
